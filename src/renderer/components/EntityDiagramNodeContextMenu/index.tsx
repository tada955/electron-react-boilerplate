import React, { useCallback, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

import Activity from '../../dataClasses/Activity';
import { removeActivity, getActivity, removeEvent, getEvent } from '../../dataClasses/HCCMModel';

import styles from './EntityDiagramNodeContextMenu.module.css';

export default function EntityDiagramNodeContextMenu({
  node,
  top,
  left,
  right,
  bottom,
  ref_mod,
  app_model,
  setAppModel,
  ...props
}) {
  const { setNodes, setEdges} = useReactFlow();

  const deleteNode = useCallback(() => {
    var new_model = app_model;
    if (node.type === 'activity') {
      const act = getActivity(new_model, node.data.activity_id)
      new_model = removeActivity(app_model, act);
    } else if (node.type === 'event') {
      const evt = getEvent(new_model, node.data.event_id)
      new_model = removeEvent(app_model, evt);
    }
    setAppModel(new_model);
    ref_mod.current = new_model;
    setNodes((nodes) => nodes.filter((n) => n.id !== node.id));

  }, [setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className={styles['node-context-menu']}
      {...props}
    >
      <button onClick={deleteNode}>Delete</button>
    </div>
  );
}