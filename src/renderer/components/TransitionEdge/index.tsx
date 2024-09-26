import { BaseEdge, EdgeProps, getBezierPath, MarkerType, getSmoothStepPath  } from '@xyflow/react';
 
export default function TransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const curvature=0.2;
  const [edgePath, labelX, labelY] = getSmoothStepPath ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  

  const lineStyle = {
    strokeWidth: 2,
    // stroke: '#FF0072',
    strokeDasharray: 5
  };
 
  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={lineStyle} />;
}

