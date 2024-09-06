import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

import styles from './EventNode.module.css';

function EventNode ({ data, selected }) {
  return (
    <>
    <NodeResizer minWidth={80} minHeight={80} isVisible={selected} color={'blue'}/>
    <Handle
          style={{ position: 'absolute', left: "50%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="a"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
      <Handle
          style={{ position: 'absolute', left: "85.35%", top: "14.65%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="b"
          type="source"
          position={Position.Top}
          isConnectable={true}
        />
      <Handle
          style={{ position: 'absolute', left: "100%", top: "50%", transform: 'translateX(-3pt) translateY(-3pt)' }}
          id="c"
          type="source"
          position={Position.Right}
          isConnectable={true}
        />
      <Handle
        style={{ position: 'absolute', left: "85.35%", top: "85.35%", transform: 'translateX(-3pt) translateY(-3pt)' }}
        id="d"
        type="source"
        position={Position.Bottom}
        isConnectable={true}
      />
      <Handle
        style={{ position: 'absolute', left: "50%", top: "100%", transform: 'translateX(-3pt) translateY(-3pt)' }}
        id="e"
        type="source"
        position={Position.Bottom}
        isConnectable={true}
      />
      <Handle
        style={{ position: 'absolute', left: "14.65%", top: "85.35%", transform: 'translateX(-3pt) translateY(-3pt)' }}
        id="f"
        type="source"
        position={Position.Bottom}
        isConnectable={true}
      />
      <Handle
        style={{ position: 'absolute', left: "0%", top: "50%", transform: 'translateX(-3pt) translateY(-3pt)' }}
        id="g"
        type="source"
        position={Position.Left}
        isConnectable={true}
      />
      <Handle
        style={{ position: 'absolute', left: "14.65%", top: "14.65%", transform: 'translateX(-3pt) translateY(-3pt)' }}
        id="h"
        type="source"
        position={Position.Top}
        isConnectable={true}
      />
      <div
        className={styles['node-event']}
      >
        {data.label}
      </div>
    </>
  );
};

export default memo(EventNode);