// based: https://github.com/xyflow/xyflow/blob/v11/packages/core/src/components/Edges/BezierEdge.tsx

import React, { memo } from "react";
import { getBezierPath, Position, BaseEdge } from "reactflow";
import { BetterBezierEdgeProps } from "./types";

export interface GetBetterBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  offset?: number;
}

interface GetControlParams {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function getControl({
  pos,
  x1,
  y1,
  x2,
  y2,
}: GetControlParams): [number, number] {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }

  return [x1, 0.5 * (y1 + y2)];
}

export function getBetterBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  offset = 0,
}: GetBetterBezierPathParams): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number
] {
  let [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  let [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });

  if (offset) {
    switch (sourcePosition) {
      case Position.Top:
        sourceControlX = sourceX;
        sourceControlY = sourceY - offset;
        break;
      case Position.Bottom:
        sourceControlX = sourceX;
        sourceControlY = sourceY + offset;
        break;
      case Position.Left:
        sourceControlX = sourceX - offset;
        sourceControlY = sourceY;
        break;
      case Position.Right:
        sourceControlX = sourceX + offset;
        sourceControlY = sourceY;
        break;
      default:
        sourceControlX = sourceX + offset;
        sourceControlY = sourceY;
    }

    switch (targetPosition) {
      case Position.Top:
        targetControlX = targetX;
        targetControlY = targetY - offset;
        break;
      case Position.Bottom:
        targetControlX = targetX;
        targetControlY = targetY + offset;
        break;
      case Position.Left:
        targetControlX = targetX - offset;
        targetControlY = targetY;
        break;
      case Position.Right:
        targetControlX = targetX + offset;
        targetControlY = targetY;
        break;
      default:
        targetControlX = targetX - offset;
        targetControlY = targetY;
    }
  }

  const [_, labelX, labelY, offsetX, offsetY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY,
  ];
}

const BetterBezierEdge = memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    markerEnd,
    markerStart,
    pathOptions,
    interactionWidth,
  }: BetterBezierEdgeProps) => {
    const [path, labelX, labelY] = getBetterBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      offset: pathOptions.offset,
    });

    return (
      <BaseEdge
        path={path}
        labelX={labelX}
        labelY={labelY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
        style={style}
        markerEnd={markerEnd}
        markerStart={markerStart}
        interactionWidth={interactionWidth}
      />
    );
  }
);

BetterBezierEdge.displayName = "BetterBezierEdge";

export default BetterBezierEdge;
