import { useState, useId, useCallback, useRef, useEffect} from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, Background, useOnSelectionChange, reconnectEdge, ConnectionMode, MarkerType, useReactFlow } from '@xyflow/react';
 
import Entity from '../../dataClasses/Entity';
import Activity from '../../dataClasses/Activity';
import Transition from '../../dataClasses/Transition';
import { getActivity, getEvent, addTransition, removeTransition, getTransitionFromTo } from '../../dataClasses/HCCMModel';
import ActivityNode from '../ActivityNode';
import EventNode from '../EventNode';
import LogicNode from '../LogicNode';
import TransitionEdge from '../TransitionEdge';
import EntityDiagramPaneContextMenu from '../EntityDiagramPaneContextMenu';
import EntityDiagramNodeContextMenu from '../EntityDiagramNodeContextMenu';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  activity: ActivityNode,
  event: EventNode,
  logic: LogicNode
};

const edgeTypes = {
  transition: TransitionEdge
};

export default function ActivityDiagram({
  ref_mod,
  app_model,
  setAppModel,
  ent,
  selectedObj,
  setSelectedObj,
  rfInstance,
  setRfInstance,
}: {
  ref_mod: any;
  app_model: any;
  setAppModel: any;
  ent?: Entity;
  selectedObj?: any;
  setSelectedObj: any;
  rfInstance: any;
  setRfInstance: any;
}) {

  if (ent) {

    const initialNodes = [];
    // const initialEdges = [{ id: 'e1-2', source: '10', sourceHandle: 'a', target: '11', targetHandle: 'h' }];
    const initialEdges = [];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { getNode } = useReactFlow();
    const [paneMenu, setPaneMenu] = useState(null);
    const [nodeMenu, setNodeMenu] = useState(null);
    const ref = useRef(null);
    const edgeReconnectSuccessful = useRef(true);
    
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [selectedEdges, setSelectedEdges] = useState([]);
  
    useEffect(() => {
      const newInst = rfInstance;
      const ent_acts = app_model.activities.filter((a) => ent.entity_activities.includes(a.id));

      var flow = null;
      if (ent.diagram_properties) {
        flow = JSON.parse(ent.diagram_properties);
      }

      const act_nodes = ent_acts.map((a) => {

        const corr_act = flow?.nodes.find((n) => n.data.activity_id === a.id);
        var node_pos;
        if (corr_act) {
          node_pos = corr_act.position;
        } else {
          node_pos = { x: 0, y: 0 };
        }

        const start_evt = getEvent(app_model, a.start_event);
        const end_evt = getEvent(app_model, a.end_event);
        return {
          id: 'activity-node-' + a.id.toString(),
          type: 'activity',
          selected: false,
          data: { label: a.name, activity_id: a.id, start_logic: (start_evt.logic > 0), end_logic: (end_evt.logic > 0) },
          position: node_pos
        }
      });

      const ent_evts = app_model.events.filter((a) => ent.entity_events.includes(a.id));

      const evt_nodes = ent_evts.map((a) => {
        const corr_evt = flow?.nodes.find((n) => n.data.event_id === a.id);
        var node_pos;
        if (corr_evt) {
          node_pos = corr_evt.position;
        } else {
          node_pos = { x: 0, y: 0 };
        }
        return {
          id: 'event-node-' + a.id.toString(),
          type: 'event',
          selected: false,
          data: { label: a.name, event_id: a.id },
          position: node_pos
        }
      });

      const ent_trns = app_model.transitions.filter((a) => ent.entity_transitions.includes(a.id));

      const trns_edges = ent_trns.map((t) => {
        const from_event = getEvent(app_model, t.from_event);
        var source_name;
        if ((from_event?.name.includes('_End')) && (from_event?.participants.length === 0)) {
          const corr_act = app_model.activities.find((a) => a.end_event === from_event.id)
          source_name = 'activity-node-' + corr_act.id.toString();
        } else {
          source_name = 'event-node-' + from_event.id.toString();
        }

        const to_event = getEvent(app_model, t.to_event);
        var target_name;
        if ((to_event?.name.includes('_Start')) && (to_event?.participants.length === 0)) {
          const corr_act = app_model.activities.find((a) => a.start_event === to_event.id)
          target_name = 'activity-node-' + corr_act.id.toString();
        } else {
          target_name = 'event-node-' + to_event.id.toString();
        }

        const corr_edge = flow?.edges.find((e) => ((source_name === e.source) && (target_name === e.target)));
        return corr_edge
      });

      setNodes(act_nodes.concat(evt_nodes));
      setEdges(trns_edges);
    }, [ent, rfInstance, setNodes]);

    const onChange = useCallback(({ nodes, edges }) => {
      if (nodes.length === 0) {
        setSelectedObj(null);
      } else if (nodes[0].type === 'event') {
        const corrEvt = getEvent(app_model, nodes[0].data.event_id);
        setSelectedObj(corrEvt);
      } else if (nodes[0].type === 'activity') {
        const corrAct = getActivity(app_model, nodes[0].data.activity_id);
        setSelectedObj(corrAct);
      }

    }, []);

    useOnSelectionChange({
      onChange,
    });

    useEffect(() => {
      if (selectedObj) {
        var selType = '';
        var start_evt = null;
        var end_evt = null;
        if (selectedObj.hasOwnProperty('start_event')) {
          selType = 'activity';
          start_evt = getEvent(app_model, selectedObj.start_event);
          end_evt = getEvent(app_model, selectedObj.end_event);
        
        }  else if (selectedObj.hasOwnProperty('state_changes')) {
          selType = 'event';
        }
        setNodes((nds) =>
          nds.map((node) => {
            if ((node.type === 'activity') && (selType === 'activity')) {
              if (node.data.activity_id === selectedObj.id) {
                // it's important that you create a new node object
                // in order to notify react flow about the change
                return {
                  ...node,
                  data: {
                    ...node.data,
                    label: selectedObj.name,
                    start_logic: (start_evt.logic > 0),
                    end_logic: (end_evt.logic > 0)
                  },
                };
              }
            } else if ((node.type === 'event') && (selType === 'event')) {
              if (node.data.event_id === selectedObj.id) {
                // it's important that you create a new node object
                // in order to notify react flow about the change
                return {
                  ...node,
                  data: {
                    ...node.data,
                    label: selectedObj.name,
                  },
                };
              }
            }
    
            return node;
          }),
        );
        setEdges((eds) => 
          eds.map((edge) => {
            const start_node_id = parseInt(edge.source.split('-')[2]);

            var from_evt;

            if (edge.source.split('-')[0] === 'activity') {
              from_evt = getEvent(app_model, getActivity(app_model, start_node_id)?.end_event);
            } else {
              from_evt = getEvent(app_model, start_node_id);
            }

            var lineStyle;
            if (from_evt.scheduled) {
              lineStyle = {
                strokeWidth: 2,
                // stroke: '#FF0072',
                // strokeDasharray: 5
              };
            } else {
              lineStyle = {
                strokeWidth: 2,
                // stroke: '#FF0072',
                strokeDasharray: 5
              };
            }

            return {
              ...edge,
              style: lineStyle
            };
          })
        );
      }
    }, [selectedObj, setSelectedObj, setNodes, setEdges]);

    function getToFromEvts(connection) {
      var evts = {from_evt: null, to_evt: null};
      const start_node_id = parseInt(connection.source.split('-')[2]);
      const end_node_id = parseInt(connection.target.split('-')[2]);

      var from_evt;
      var to_evt;

      if (connection.source.split('-')[0] === 'activity') {
        from_evt = getEvent(app_model, getActivity(app_model, start_node_id)?.end_event);
      } else {
        from_evt = getEvent(app_model, start_node_id);
      }

      if (connection.target.split('-')[0] === 'activity') {
        to_evt = getEvent(app_model, getActivity(app_model, end_node_id)?.start_event);
      } else {
        to_evt = getEvent(app_model, end_node_id);
      }
      evts.from_evt = from_evt;
      evts.to_evt = to_evt;

      return evts;
    }

    const onReconnectStart = useCallback(() => {
      edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback(
      (oldEdge, newConnection) => {
        const old_evts = getToFromEvts(oldEdge);
        const new_evts = getToFromEvts(newConnection);

        const corr_trns = getTransitionFromTo(app_model, old_evts.from_evt.id, old_evts.to_evt.id);
        corr_trns.from_event = new_evts.from_evt.id;
        corr_trns.to_event = new_evts.to_evt.id;

        app_model.transitions = app_model.transitions.map((a) => {
          if (a.id === corr_trns.id) {
            return corr_trns;
          } else {
            return a;
          }
        });
        setAppModel(app_model);
        ref_mod.curent = app_model;

        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
      }, [],
    );

    const onReconnectEnd = useCallback((_, edge) => {
      if (!edgeReconnectSuccessful.current) {

        const edge_evts = getToFromEvts(edge);
        const corr_trns = getTransitionFromTo(app_model, edge_evts.from_evt.id, edge_evts.to_evt.id);
        const new_model = removeTransition(app_model, corr_trns)
        setAppModel(new_model);
        ref_mod.curent = new_model;
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
  
      edgeReconnectSuccessful.current = true;
    }, []);

    const onConnect = useCallback(
      (params) => {
        const edge_evts = getToFromEvts(params);

        const num_trns = app_model.transitions.length
        var nextId = 0;
        if (num_trns === 0) {
          nextId = 1;
        } else {
          nextId = app_model.transitions[num_trns - 1].id + 1
        }

        const newTrns = new Transition(nextId, 'Transition' + nextId.toString(), edge_evts.from_evt.id, edge_evts.to_evt.id, ent.id)
        const new_model = addTransition(app_model, newTrns);
        setAppModel(new_model);
        ref_mod.curent = new_model;

        const endMarkStyle = {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          // color: '#FF0072',
        };

        var lineStyle;
        if (edge_evts.from_evt.scheduled) {
          lineStyle = {
            strokeWidth: 2,
            // stroke: '#FF0072',
            // strokeDasharray: 5
          };
        } else {
          lineStyle = {
            strokeWidth: 2,
            // stroke: '#FF0072',
            strokeDasharray: 5
          };
        }
        params.type = 'smoothstep';
        params.markerEnd = endMarkStyle;
        params.style = lineStyle;
        setEdges((eds) => addEdge(params, eds))},
      [ent, setEdges],
    );

    const onPaneContextMenu = useCallback(
      (event) => {
        // Prevent native context menu from showing
        event.preventDefault();
        setNodeMenu(null);
  
        // Calculate position of the context menu. We want to make sure it
        // doesn't get positioned off-screen.
        const pane = ref.current.getBoundingClientRect();
        setPaneMenu({
          screenX: event.clientX,
          screenY: event.clientY,
          top: event.clientY - pane.top,
          left: event.clientX - pane.left,
          right: pane.width - event.clientX + pane.left - 80,
          bottom: pane.height - event.clientY + pane.top - 100,
          ref_mod: ref_mod,
          app_model: app_model,
          setAppModel: setAppModel,
          ent: ent,
        });
      },
      [app_model, setAppModel, ent, setPaneMenu],
    );

    const onNodeContextMenu = useCallback(
      (event, node) => {
        // Prevent native context menu from showing
        event.preventDefault();
        setPaneMenu(null);
  
        // Calculate position of the context menu. We want to make sure it
        // doesn't get positioned off-screen.
        const pane = ref.current.getBoundingClientRect();
        setNodeMenu({
          node: node,
          top: event.clientY - pane.top,
          left: event.clientX - pane.left,
          right: pane.width - event.clientX + pane.left - 80,
          bottom: pane.height - event.clientY + pane.top - 100,
          ref_mod: ref_mod,
          app_model: app_model,
          setAppModel: setAppModel,
        });
      },
      [app_model, setAppModel, setNodeMenu],
    );

    const onPaneClick = useCallback(() => {
      setPaneMenu(null);
      setNodeMenu(null);
    }, [setPaneMenu, setNodeMenu]);

    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          ref={ref}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          onPaneContextMenu={onPaneContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          onInit={setRfInstance}
          snapToGrid={true}
        >
          <Background />
          {paneMenu && <EntityDiagramPaneContextMenu onClick={onPaneClick} {...paneMenu} />}
          {nodeMenu && <EntityDiagramNodeContextMenu onClick={onPaneClick} {...nodeMenu} />}
        </ReactFlow>
      </div>
    );
  } else {
    return <div></div>;
  }

}