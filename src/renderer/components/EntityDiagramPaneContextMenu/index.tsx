import React, { useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

import Activity from '../../dataClasses/Activity';
import Event from '../../dataClasses/Event';
import { addActivity, addEvent } from '../../dataClasses/HCCMModel';

import styles from './EntityDiagramPaneContextMenu.module.css';

export default function EntityDiagramPaneContextMenu({
  screenX,
  screenY,
  top,
  left,
  right,
  bottom,
  app_model,
  setAppModel,
  ent,
  ...props
}) {
  const { getNodes, addNodes, setNodes, screenToFlowPosition} = useReactFlow();

  const AddNode = useCallback(() => {

    const num_acts = app_model.activities.length
    var nextId = 0;
    if (num_acts === 0) {
      nextId = 1;
    } else {
      nextId = app_model.activities[num_acts - 1].id + 1
    }

    const newAct = new Activity(nextId, 'New Activity', 0, 0, [ent.id])
    const new_model = addActivity(app_model, newAct);
    setAppModel(new_model);

    setNodes((nds) =>
      nds.map((node) => {
        // it's important that you create a new node object
        // in order to notify react flow about the change
        return {
          ...node,
          selected: false,
        };
      }),
    );

    const position = screenToFlowPosition({
      x: screenX,
      y: screenY,
    });

    const newNode = {
      data: { label: newAct.name, activity_id: nextId},
      type: 'activity',
      selected: true,
      dragging: false,
      id: 'activity-node-' + nextId.toString(),
      position,
    };

    addNodes(newNode);
  }, [getNodes, addNodes]);

  const AddEvent = useCallback(() => {

    const num_evts = app_model.events.length
    var nextId = 0;
    if (num_evts === 0) {
      nextId = 1;
    } else {
      nextId = app_model.events[num_evts - 1].id + 1
    }

    const newEvt = new Event(nextId, 'New Event', true, [ent.id], )
    const new_model = addEvent(app_model, newEvt);
    setAppModel(new_model);

    setNodes((nds) =>
      nds.map((node) => {
        // it's important that you create a new node object
        // in order to notify react flow about the change
        return {
          ...node,
          selected: false,
        };
      }),
    );

    const position = screenToFlowPosition({
      x: screenX,
      y: screenY,
    });

    const newNode = {
      data: { label: newEvt.name, event_id: nextId },
      type: 'event',
      selected: true,
      dragging: false,
      id: 'event-node-' + nextId.toString(),
      position,
    };

    addNodes(newNode);
  }, [getNodes, addNodes]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className={styles['pane-context-menu']}
      {...props}
    >
      <button onClick={AddNode}>Add an Activity</button>
      <button onClick={AddEvent}>Add an Event</button>
    </div>
  );
}