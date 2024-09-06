import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

import styles from './ActivityNode.module.css';

function ActivityNode({ data, selected }) {
  return (
    <>
      <NodeResizer minWidth={120} minHeight={50} isVisible={selected} color={'blue'}/>
      <Handle
          style={{ position: 'absolute', left: "25%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="a"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "50%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="b"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "75%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="c"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "25%", transform: 'translateX(3pt) translateY(-3pt)' }}
          id="d"
          type="source"
          position={Position.Right}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "50%", transform: 'translateX(3pt) translateY(-3pt)' }}
          id="e"
          type="source"
          position={Position.Right}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "75%", transform: 'translateX(3pt) translateY(-3pt)' }}
          id="f"
          type="source"
          position={Position.Right}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "75%", transform: 'translateX(-3pt) translateY(3pt)' }}
          id="g"
          type="source"
          position={Position.Bottom}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', left: "50%", transform: 'translateX(-3pt) translateY(3pt)' }}
          id="h"
          type="source"
          position={Position.Bottom}
        />
        <Handle
          style={{ position: 'absolute', left: "25%", transform: 'translateX(-3pt) translateY(3pt)' }}
          id="i"
          type="source"
          position={Position.Bottom}
        />
        <Handle
          style={{ position: 'absolute', top: "75%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="j"
          type="source"
          position={Position.Left}
          isConnectable={true}
        />
        <Handle
          style={{ position: 'absolute', top: "50%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="k"
          type="source"
          position={Position.Left}
        />
        <Handle
          style={{ position: 'absolute', top: "25%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="l"
          type="source"
          position={Position.Left}
        />
      <div className={styles['node-activity']}>{data.label}</div>
    </>
  );
}

export default memo(ActivityNode);