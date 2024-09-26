import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

import styles from './LogicNode.module.css';

function LogicNode ({ data, selected }) {
  return (
    <>
      <div
        className={styles['node-logic']}
      >

      </div>
    </>
  );
};

export default memo(LogicNode);