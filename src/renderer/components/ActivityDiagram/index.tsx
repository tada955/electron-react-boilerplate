import { useState, useId, useCallback, useRef, useEffect} from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, Background, useOnSelectionChange } from '@xyflow/react';
 
import Entity from '../../dataClasses/Entity';
import Activity from '../../dataClasses/Activity';
import { getActivity, getEvent } from '../../dataClasses/HCCMModel';
import ActivityNode from '../ActivityNode';
import EventNode from '../EventNode';
import EntityDiagramPaneContextMenu from '../EntityDiagramPaneContextMenu';
import EntityDiagramNodeContextMenu from '../EntityDiagramNodeContextMenu';

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  activity: ActivityNode,
  event: EventNode
};

export default function ActivityDiagram({
  app_model,
  setAppModel,
  ent,
  selectedObj,
  setSelectedObj
}: {
  app_model: any;
  setAppModel: any;
  ent?: Entity;
  selectedObj?: any;
  setSelectedObj: any
}) {

  if (ent) {

    const initialNodes = [
      { id: '10', type: 'activity', position: { x: 0, y: 0 }, data: { label: '1' }, style: {
        width: 120,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255)',
        color: 'black',
      } },
      { id: '11', type: 'activity', position: { x: 0, y: 100 }, data: { label: '2' } },
      { id: '12', type: 'event', position: { x: 20, y: 100 }, data: { label: '3' } },
    ];
    const initialEdges = [{ id: 'e1-2', source: '10', sourceHandle: 'a', target: '11', targetHandle: 'h' }];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [paneMenu, setPaneMenu] = useState(null);
    const [nodeMenu, setNodeMenu] = useState(null);
    const ref = useRef(null);

    const [selectedNodes, setSelectedNodes] = useState([]);
    const [selectedEdges, setSelectedEdges] = useState([]);
  
    useEffect(() => {
      const ent_acts = app_model.activities.filter((a) => ent.entity_activities.includes(a.id));

      const act_nodes = ent_acts.map((a) => {
        return {
          id: 'activity-node-' + a.id.toString(),
          type: 'activity',
          selected: false,
          data: { label: a.name, activity_id: a.id },
          position: { x: 0, y: 0 }
        }
      });

      const ent_evts = app_model.events.filter((a) => ent.entity_events.includes(a.id));

      const evt_nodes = ent_evts.map((a) => {
        return {
          id: 'event-node-' + a.id.toString(),
          type: 'event',
          selected: false,
          data: { label: a.name, event_id: a.id },
          position: { x: 0, y: 0 }
        }
      });
      setNodes(act_nodes.concat(evt_nodes));
    }, [ent, setNodes]);

    const onChange = useCallback(({ nodes, edges }) => {
      // setSelectedNodes(nodes.map((node) => node.id));
      // setSelectedEdges(edges.map((edge) => edge.id));
      const x = 1;
      const new_model = app_model;

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
        if (selectedObj.hasOwnProperty('start_event')) {
          selType = 'activity';
        
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
      }
    }, [selectedObj, setSelectedObj, setNodes]);

    const onConnect = useCallback(
      (params) => setEdges((eds) => addEdge(params, eds)),
      [setEdges],
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
          onPaneContextMenu={onPaneContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          connectionMode={"loose"}
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