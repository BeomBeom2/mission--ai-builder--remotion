/**
 * TreeDiagram — d3-hierarchy 기반 트리 다이어그램 컴포넌트
 *
 * 사용법:
 *   const data: TreeNode = {
 *     label: "제어문",
 *     color: "#9cdcfe",
 *     children: [
 *       { label: "조건문", color: "#c586c0", dim: true },
 *       { label: "반복문", color: "#4ec9b0", children: [...] },
 *     ],
 *   };
 *   <TreeDiagram data={data} width={700} height={400} />
 */
import { interpolate } from "remotion";

import React from "react";

import { hierarchy, tree } from "d3-hierarchy";

import { FONT, monoStyle, uiFont } from "./scene";

// ── 데이터 타입 ──────────────────────────────────────────────
export interface TreeNode {
  /** 노드에 표시할 텍스트 */
  label: string;
  /** 노드 테두리/텍스트 색상 */
  color: string;
  /** true면 흐릿하게 표시 (이미 다룬/비활성 주제) */
  dim?: boolean;
  /** 0~1 opacity (dim보다 세밀한 제어. 생략하면 dim ? 0.38 : 1) */
  opacity?: number;
  /** 0~1 appear spring 값 (생략하면 1) */
  appear?: number;
  /** 모노스페이스 폰트 사용 여부 (코드 키워드용) */
  mono?: boolean;
  /** 커스텀 fontSize (생략하면 기본값) */
  fontSize?: number;
  /** 강조 효과 (boxShadow glow) */
  glow?: boolean;
  /** 자식 노드 */
  children?: TreeNode[];
}

// ── 컴포넌트 Props ───────────────────────────────────────────
interface TreeDiagramProps {
  data: TreeNode;
  /** SVG 전체 폭 */
  width?: number;
  /** SVG 전체 높이 */
  height?: number;
  /** 노드 간 수직 간격 — 기본 120 */
  levelHeight?: number;
  /** 리프 노드 간 수평 간격 — 기본 200 */
  leafSpacing?: number;
  /** 연결선 색상 */
  lineColor?: string;
  /** 연결선 굵기 */
  lineWidth?: number;
  /** 노드 좌우 패딩 — 기본 36 */
  nodePaddingX?: number;
  /** 노드 상하 패딩 — 기본 16 */
  nodePaddingY?: number;
  /** 노드 뒤 불투명 배경색 (연결선 가림용) — 기본 "#1e1e1e" */
  bgColor?: string;
}

// ── 기본 스타일 ──────────────────────────────────────────────
const C_DIM = "rgba(255,255,255,0.22)";

/** 텍스트 길이를 대략 추정 (한글 1글자 ≈ 영문 2글자) */
function estimateTextWidth(text: string, fontSize: number): number {
  let count = 0;
  for (const ch of text) {
    count += ch.charCodeAt(0) > 127 ? 1.1 : 0.62;
  }
  return count * fontSize;
}

// ── 컴포넌트 ─────────────────────────────────────────────────
export const TreeDiagram: React.FC<TreeDiagramProps> = ({
  data,
  width = 700,
  height = 400,
  levelHeight = 120,
  leafSpacing = 200,
  lineColor = "rgba(255,255,255,0.25)",
  lineWidth = 2,
  nodePaddingX = 36,
  nodePaddingY = 16,
  bgColor = "#1e1e1e",
}) => {
  // d3-hierarchy 레이아웃 계산
  const root = hierarchy(data);
  const leaves = root.leaves().length;
  const treeWidth = Math.max(leaves * leafSpacing, 300);

  const treeLayout = tree<TreeNode>().size([
    treeWidth,
    root.height * levelHeight,
  ]);
  treeLayout(root);

  // 중앙 정렬을 위한 오프셋
  const offsetX = (width - treeWidth) / 2;
  const offsetY = 40; // 상단 여백

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <g transform={`translate(${offsetX}, ${offsetY})`}>
        {/* 연결선 — 직각 꺾임 (수직→수평→수직) */}
        {root.links().map((link, i) => {
          const parentAppear = link.source.data.appear ?? 1;
          const childAppear = link.target.data.appear ?? 1;
          const linkOpacity = Math.min(parentAppear, childAppear);

          return (
            <path
              key={`link-${i}`}
              d={`M${link.source.x!},${link.source.y!}
                  V${(link.source.y! + link.target.y!) / 2}
                  H${link.target.x!}
                  V${link.target.y!}`}
              fill="none"
              stroke={lineColor}
              strokeWidth={lineWidth}
              opacity={linkOpacity}
            />
          );
        })}

        {/* 불투명 배경 — 연결선 가림 (opacity 그룹 밖에서 렌더) */}
        {root.descendants().map((node, i) => {
          const d = node.data;
          const appear = d.appear ?? 1;
          const isMono = d.mono ?? false;
          const fontSize = d.fontSize ?? (isMono ? 34 : FONT.heading);

          const sc = interpolate(appear, [0, 1], [0.75, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const textW = estimateTextWidth(d.label, fontSize);
          const rectW = textW + nodePaddingX * 2;
          const rectH = fontSize + nodePaddingY * 2;

          return (
            <rect
              key={`bg-${i}`}
              x={node.x! - rectW / 2}
              y={node.y! - rectH / 2}
              width={rectW}
              height={rectH}
              rx={16}
              fill={bgColor}
              opacity={appear}
              transform={`translate(${node.x!}, ${node.y!}) scale(${sc}) translate(${-node.x!}, ${-node.y!})`}
            />
          );
        })}

        {/* 노드 (스타일 배경 + 텍스트) */}
        {root.descendants().map((node, i) => {
          const d = node.data;
          const appear = d.appear ?? 1;
          const isDim = d.dim ?? false;
          const nodeOpacity = d.opacity ?? (isDim ? 0.38 : 1);
          const isMono = d.mono ?? false;
          const fontSize = d.fontSize ?? (isMono ? 34 : FONT.heading);
          const glow = d.glow ?? false;

          const sc = interpolate(appear, [0, 1], [0.75, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const nodeColor = isDim ? C_DIM : d.color;
          const nodeBgColor = isDim ? "rgba(255,255,255,0.04)" : `${d.color}18`;
          const borderColor = isDim ? "rgba(255,255,255,0.1)" : `${d.color}66`;

          const textW = estimateTextWidth(d.label, fontSize);
          const rectW = textW + nodePaddingX * 2;
          const rectH = fontSize + nodePaddingY * 2;

          return (
            <g
              key={`node-${i}`}
              transform={`translate(${node.x!}, ${node.y!}) scale(${sc})`}
              opacity={appear * nodeOpacity}
            >
              {/* 스타일 배경 rect */}
              <rect
                x={-rectW / 2}
                y={-rectH / 2}
                width={rectW}
                height={rectH}
                rx={16}
                fill={nodeBgColor}
                stroke={borderColor}
                strokeWidth={2}
                filter={glow ? `drop-shadow(0 0 16px ${d.color}55)` : undefined}
              />
              {/* 텍스트 */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={nodeColor}
                fontFamily={isMono ? monoStyle.fontFamily : uiFont}
                fontSize={fontSize}
                fontWeight={isMono ? 900 : 700}
                style={
                  isMono
                    ? {
                        fontFeatureSettings: monoStyle.fontFeatureSettings,
                      }
                    : undefined
                }
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
