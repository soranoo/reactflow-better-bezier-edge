import {
  type EdgeProps,
} from "reactflow";

export type BetterBezierPathOptions = {
  offset?: number;
};

export type BetterBezierEdgeProps<T = any> = EdgeProps<T> & {
  pathOptions?: BetterBezierPathOptions;
};
