import React from "react";

export interface TreeNode {
  label: string;
  color: string;
  dim?: boolean;
  opacity?: number;
  appear?: number;
  mono?: boolean;
  fontSize?: number;
  glow?: boolean;
  children?: TreeNode[];
}

export const TreeDiagram: React.FC<Record<string, unknown>> = () => null;
