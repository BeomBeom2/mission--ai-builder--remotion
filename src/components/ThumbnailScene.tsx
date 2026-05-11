// src/components/ThumbnailScene.tsx
import { AbsoluteFill } from "remotion";

import React from "react";

import { MONO_NO_LIGA, monoFont, uiFont } from "../utils/scene";

interface ThumbnailSceneProps {
  /** 상단 시리즈 라벨 (e.g. "JAVA") */
  seriesLabel: string;
  /** 메인 제목. \n 으로 줄바꿈 */
  title: string;
  /** 제목 아래 작은 부제목 */
  subtitle?: string;
  /** 하단 뱃지 텍스트 (e.g. "for", "if") */
  badge: string;
  /** 포인트 컬러 (기본: teal #4ec9b0) */
  accentColor?: string;
}

export const ThumbnailScene: React.FC<ThumbnailSceneProps> = ({
  seriesLabel,
  title,
  subtitle,
  badge,
  accentColor = "#4ec9b0",
}) => {
  const lines = title.split("\n");
  return (
    <AbsoluteFill
      style={{
        background: "#050510",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* 배경 glow */}
      <div
        style={{
          position: "absolute",
          width: 860,
          height: 860,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}1f 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* 시리즈 라벨 */}
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 26,
          fontWeight: 700,
          color: accentColor,
          letterSpacing: 10,
          opacity: 0.8,
        }}
      >
        {seriesLabel}
      </div>
      {/* 제목 */}
      <div
        style={{
          fontFamily: uiFont,
          fontSize: 108,
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          color: "#fff",
          textShadow: `0 0 60px ${accentColor}99, 0 0 120px ${accentColor}4d`,
        }}
      >
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {i === lines.length - 1 ? (
              <span style={{ color: accentColor }}>{line}</span>
            ) : (
              line
            )}
          </React.Fragment>
        ))}
      </div>
      {subtitle ? (
        <div
          style={{
            fontFamily: uiFont,
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.2,
            textAlign: "center",
            color: "#d8def5",
            marginTop: 8,
          }}
        >
          {subtitle}
        </div>
      ) : null}
      {/* 배지 */}
      <div
        style={{
          fontFamily: monoFont,
          fontFeatureSettings: MONO_NO_LIGA,
          fontSize: 64,
          fontWeight: 900,
          color: accentColor,
          background: `${accentColor}18`,
          border: `2px solid ${accentColor}55`,
          borderRadius: 18,
          padding: "18px 56px",
          marginTop: 8,
        }}
      >
        {badge}
      </div>
    </AbsoluteFill>
  );
};
