import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

import styles from './ActivityNode.module.css';

function ActivityNode({ data, selected }) {
  // return
  var start_log = <div></div>
  if (data.start_logic === true) {
    start_log = <div className={styles['node-start-logic']}></div>
  }

  var end_log = <div></div>
  if (data.end_logic === true) {
    end_log = <div className={styles['node-end-logic']}></div>
  }

  return (
    <>
      <NodeResizer minWidth={120} minHeight={50} isVisible={selected} color={'blue'}/>
      <Handle
          style={{ position: 'absolute', left: "25%", transform: 'translateX(-3pt) translateY(-3pt)', zIndex: -1 }}
          id="a"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "50%", transform: 'translateX(-3pt) translateY(-3pt)', zIndex: -1 }}
          id="b"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "75%", transform: 'translateX(-3pt) translateY(-3pt)', zIndex: -1 }}
          id="c"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "25%", transform: 'translateX(3pt) translateY(-3pt)', zIndex: -1 }}
          id="d"
          type="source"
          position={Position.Right}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "50%", transform: 'translateX(3pt) translateY(-3pt)', zIndex: -1 }}
          id="e"
          type="source"
          position={Position.Right}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "75%", transform: 'translateX(3pt) translateY(-3pt)', zIndex: -1 }}
          id="f"
          type="source"
          position={Position.Right}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "75%", transform: 'translateX(-3pt) translateY(3pt)', zIndex: -1 }}
          id="g"
          type="source"
          position={Position.Bottom}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "50%", transform: 'translateX(-3pt) translateY(3pt)', zIndex: -1 }}
          id="h"
          type="source"
          position={Position.Bottom}
        />
        <Handle
          style={{ position: 'absolute', left: "25%", transform: 'translateX(-3pt) translateY(3pt)', zIndex: -1 }}
          id="i"
          type="source"
          position={Position.Bottom}
        />
        <Handle
          style={{ position: 'absolute', top: "75%", transform: 'translateX(-3pt) translateY(-3pt)', zIndex: -1 }}
          id="j"
          type="source"
          position={Position.Left}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "50%", transform: 'translateX(-3pt) translateY(-3pt)', zIndex: -1 }}
          id="k"
          type="source"
          position={Position.Left}
        />
        <Handle
          style={{ position: 'absolute', top: "25%", transform: 'translateX(-3pt) translateY(-3pt)', zIndex: -1 }}
          id="l"
          type="source"
          position={Position.Left}
        />
      <div className={styles['node-activity']}>
        {start_log}
        <div className={styles['node-name']}>{data.label}</div>
        {end_log}
      </div>
      
    </>
  );
}

export default memo(ActivityNode);