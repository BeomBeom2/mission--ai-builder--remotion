/**
 * ElementArrow — getBoundingClientRect + useCurrentScale 기반 화살표.
 *
 * Remotion은 영상을 scale() 축소해서 보여주므로
 * getBoundingClientRect 값을 useCurrentScale()로 보정합니다.
 *
 * 사용법:
 *   const fromRef = useRef<HTMLDivElement>(null);
 *   const toRef = useRef<HTMLDivElement>(null);
 *   <ElementArrow
 *     containerRef={containerRef}
 *     from={{ ref: fromRef, anchor: "right-center" }}
 *     to={{ ref: toRef, anchor: "left-center", padding: 10 }}
 *   />
 *
 * 부모에 position: relative 필수.
 */
import { useCurrentFrame, useCurrentScale } from "remotion";

import React, { useId, useLayoutEffect, useState } from "react";

type LegacyAnchor = "top" | "bottom" | "left" | "right" | "center";

export type ArrowAnchor =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-top"
  | "right-center"
  | "right-bottom"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "center";

export interface ArrowEndpoint {
  ref: React.RefObject<HTMLElement | null>;
  anchor?: ArrowAnchor;
  padding?: number;
  gap?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface ElementArrowProps {
  /** 화살표가 position:absolute로 배치될 기준 부모 */
  containerRef: React.RefObject<HTMLElement | null>;
  from: ArrowEndpoint;
  to: ArrowEndpoint;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  dash?: boolean;
  headSize?: number;
  zIndex?: number;
  curve?: number;
  avoidContent?: boolean;
  routePadding?: number;
}

export interface RefArrowProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  fromAnchor?: LegacyAnchor;
  toAnchor?: LegacyAnchor;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  dash?: boolean;
  headSize?: number;
  curve?: number;
  avoidContent?: boolean;
  routePadding?: number;
}

function anchorPt(rect: DOMRect, anchor: ArrowAnchor, scale: number) {
  const w = rect.width / scale;
  const h = rect.height / scale;
  const l = rect.left / scale;
  const t = rect.top / scale;
  const cx = l + w / 2;
  const cy = t + h / 2;

  switch (anchor) {
    case "top-left":
      return { x: l, y: t };
    case "top-center":
      return { x: cx, y: t };
    case "top-right":
      return { x: l + w, y: t };
    case "right-top":
      return { x: l + w, y: t };
    case "right-center":
      return { x: l + w, y: cy };
    case "right-bottom":
      return { x: l + w, y: t + h };
    case "bottom-left":
      return { x: l, y: t + h };
    case "bottom-center":
      return { x: cx, y: t + h };
    case "bottom-right":
      return { x: l + w, y: t + h };
    case "left-top":
      return { x: l, y: t };
    case "left-center":
      return { x: l, y: cy };
    case "left-bottom":
      return { x: l, y: t + h };
    case "center":
      return { x: cx, y: cy };
  }
}

function applyGapAndOffset(
  point: { x: number; y: number },
  anchor: ArrowAnchor,
  padding = 0,
  offsetX = 0,
  offsetY = 0,
) {
  switch (anchor) {
    case "top-left":
    case "top-center":
    case "top-right":
      return { x: point.x + offsetX, y: point.y - padding + offsetY };
    case "right-top":
    case "right-center":
    case "right-bottom":
      return { x: point.x + padding + offsetX, y: point.y + offsetY };
    case "bottom-left":
    case "bottom-center":
    case "bottom-right":
      return { x: point.x + offsetX, y: point.y + padding + offsetY };
    case "left-top":
    case "left-center":
    case "left-bottom":
      return { x: point.x - padding + offsetX, y: point.y + offsetY };
    case "center":
      return { x: point.x + offsetX, y: point.y + offsetY };
  }
}

function legacyAnchorToAnchor(anchor: LegacyAnchor): ArrowAnchor {
  switch (anchor) {
    case "top":
      return "top-center";
    case "bottom":
      return "bottom-center";
    case "left":
      return "left-center";
    case "right":
      return "right-center";
    case "center":
      return "center";
  }
}

function anchorDir(anchor: ArrowAnchor) {
  switch (anchor) {
    case "top-left":
      return { x: -0.707, y: -0.707 };
    case "top-center":
      return { x: 0, y: -1 };
    case "top-right":
      return { x: 0.707, y: -0.707 };
    case "right-top":
      return { x: 1, y: -0.35 };
    case "right-center":
      return { x: 1, y: 0 };
    case "right-bottom":
      return { x: 1, y: 0.35 };
    case "bottom-left":
      return { x: -0.707, y: 0.707 };
    case "bottom-center":
      return { x: 0, y: 1 };
    case "bottom-right":
      return { x: 0.707, y: 0.707 };
    case "left-top":
      return { x: -1, y: -0.35 };
    case "left-center":
      return { x: -1, y: 0 };
    case "left-bottom":
      return { x: -1, y: 0.35 };
    case "center":
      return { x: 0, y: 0 };
  }
}

interface LineData {
  width: number;
  height: number;
  fx: number;
  fy: number;
  tx: number;
  ty: number;
  length: number;
}

export const ElementArrow: React.FC<ElementArrowProps> = ({
  containerRef,
  from,
  to,
  color = "#4ec9b0",
  strokeWidth = 3,
  opacity = 1,
  dash = true,
  headSize = 14,
  zIndex = 9999,
  curve = 0,
  avoidContent = true,
  routePadding,
}) => {
  const frame = useCurrentFrame();
  const scale = useCurrentScale() || 1;
  const markerId = useId().replace(/:/g, "_");
  const [line, setLine] = useState<LineData | null>(null);

  useLayoutEffect(() => {
    if (opacity <= 0) return;

    const container = containerRef.current;
    const fromEl = from.ref.current;
    const toEl = to.ref.current;
    if (!container || !fromEl || !toEl) return;

    const cRect = container.getBoundingClientRect();
    const cLeft = cRect.left / scale;
    const cTop = cRect.top / scale;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    const fRect = fromEl.getBoundingClientRect();
    const tRect = toEl.getBoundingClientRect();

    const fp = applyGapAndOffset(
      anchorPt(fRect, from.anchor ?? "right-center", scale),
      from.anchor ?? "right-center",
      from.padding ?? from.gap,
      from.offsetX,
      from.offsetY,
    );
    const tp = applyGapAndOffset(
      anchorPt(tRect, to.anchor ?? "left-center", scale),
      to.anchor ?? "left-center",
      to.padding ?? to.gap,
      to.offsetX,
      to.offsetY,
    );

    const fx = fp.x - cLeft;
    const fy = fp.y - cTop;
    const tx = tp.x - cLeft;
    const ty = tp.y - cTop;

    const dx = tx - fx;
    const dy = ty - fy;
    const length = Math.sqrt(dx * dx + dy * dy);

    setLine((prev) => {
      if (
        prev &&
        Math.abs(prev.width - width) < 1 &&
        Math.abs(prev.height - height) < 1 &&
        Math.abs(prev.fx - fx) < 1 &&
        Math.abs(prev.fy - fy) < 1 &&
        Math.abs(prev.tx - tx) < 1 &&
        Math.abs(prev.ty - ty) < 1
      ) {
        return prev;
      }
      return { width, height, fx, fy, tx, ty, length };
    });
  }, [frame, opacity, containerRef, from, to, scale]);

  if (opacity <= 0 || !line) return null;

  const dx = line.tx - line.fx;
  const dy = line.ty - line.fy;
  const safeLength = Math.max(1, line.length);
  const nx = -dy / safeLength;
  const ny = dx / safeLength;
  const fromAnchor = from.anchor ?? "right-center";
  const toAnchor = to.anchor ?? "left-center";
  const fromDir = anchorDir(fromAnchor);
  const toDir = anchorDir(toAnchor);
  const route = routePadding ?? Math.max(26, Math.min(84, safeLength * 0.22));
  const c1x = line.fx + fromDir.x * route + nx * curve;
  const c1y = line.fy + fromDir.y * route + ny * curve;
  const c2x = line.tx + toDir.x * route + nx * curve;
  const c2y = line.ty + toDir.y * route + ny * curve;
  const qx = (line.fx + line.tx) / 2 + nx * curve;
  const qy = (line.fy + line.ty) / 2 + ny * curve;
  const pathD = avoidContent
    ? `M ${line.fx} ${line.fy} C ${c1x} ${c1y} ${c2x} ${c2y} ${line.tx} ${line.ty}`
    : Math.abs(curve) > 0.5
      ? `M ${line.fx} ${line.fy} Q ${qx} ${qy} ${line.tx} ${line.ty}`
      : `M ${line.fx} ${line.fy} L ${line.tx} ${line.ty}`;

  return (
    <svg
      width={line.width}
      height={line.height}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
        pointerEvents: "none",
        zIndex,
        opacity,
      }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth={headSize}
          markerHeight={headSize}
          refX={headSize - 1}
          refY={headSize / 2}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path
            d={`M 0 0 L ${headSize} ${headSize / 2} L 0 ${headSize} z`}
            fill={color}
          />
        </marker>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dash ? "8 6" : undefined}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
};

export const RefArrow: React.FC<RefArrowProps> = ({
  containerRef,
  fromRef,
  toRef,
  fromAnchor = "right",
  toAnchor = "left",
  color,
  strokeWidth,
  opacity,
  dash,
  headSize,
  curve,
  avoidContent,
  routePadding,
}) => {
  return (
    <ElementArrow
      containerRef={containerRef}
      from={{ ref: fromRef, anchor: legacyAnchorToAnchor(fromAnchor) }}
      to={{ ref: toRef, anchor: legacyAnchorToAnchor(toAnchor) }}
      color={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
      dash={dash}
      headSize={headSize}
      curve={curve}
      avoidContent={avoidContent}
      routePadding={routePadding}
    />
  );
};
