import { Composition, Folder, Internals } from "remotion";

import React, { useEffect } from "react";

import { AudioBaseDirProvider } from "./utils/scene";

// compositions/ 폴더의 모든 .tsx 파일을 자동으로 불러옵니다.
// 새 영상을 추가하려면 compositions/<series>/ 에 파일을 만들고 아래 exports 를 추가하면 됩니다:
//   export const compositionMeta = { fps, width, height }
//   export const VIDEO_CONFIG = { sceneA: { durationInFrames }, ... }
//   export const Component: React.FC = ...
//
// 파일 경로 → Remotion ID 규칙:
//   src/compositions/001-Java-Basic/KOR/001-1-JavaVariables.tsx  →  folder "001-Java-Basic > KOR", id "001"
//   render: pnpm render 001-Java-Basic/KOR/001

interface CompositionModule {
  compositionMeta: {
    fps: number;
    width: number;
    height: number;
    durationInFrames?: number;
  };
  VIDEO_CONFIG: Record<string, { durationInFrames: number }>;
  Component: React.FC;
}

const ctx = require.context("./compositions", true, /\d+-.*\.tsx$/);
const entries = ctx
  .keys()
  .map((key: string) => {
    const mod = ctx(key) as CompositionModule;
    if (!mod.compositionMeta || !mod.VIDEO_CONFIG || !mod.Component)
      return null;
    // 경로 파싱: "./001-Java-Basic/KOR/001-JavaVariables.tsx"
    const segments = key.replace(/^\.\//, "").split("/");
    const seriesFolder = segments[0]; // "001-Java-Basic" — Folder 그룹핑용
    // 파일 직전 세그먼트가 대문자 2~3자이면 언어 폴더로 간주
    const langFolder =
      segments.length >= 3 && /^[A-Z]{2,3}$/.test(segments[segments.length - 2])
        ? segments[segments.length - 2]
        : null; // "KOR"
    // 파일명 패턴: "001-1-JavaVariables.tsx" (에피소드번호-타입-이름)
    // 첫 번째 숫자 그룹이 에피소드 번호, 두 번째가 파일 타입 (1=tsx, 2=audio.gen, 3=sub.gen)
    const filename = segments[segments.length - 1];
    const epMatch = filename.match(/^(\d+)-\d+-/);
    const epMatchLegacy = filename.match(/^(\d+)-/);
    const epNum = epMatch
      ? epMatch[1]
      : epMatchLegacy
        ? epMatchLegacy[1]
        : filename; // "001"
    const dirPrefix = seriesFolder.match(/^(\d+)/)?.[1] ?? seriesFolder; // "001"
    // 언어 폴더가 있으면 "001-KOR-001" 형태 (Remotion ID는 슬래시 불가).
    // 언어 폴더가 없으면 기존 방식(001-001)으로 fallback.
    const ep = langFolder
      ? [dirPrefix, langFolder, epNum].join("-")
      : [dirPrefix, epNum].filter(Boolean).join("-");
    const totalFrames =
      mod.compositionMeta.durationInFrames ??
      Object.values(mod.VIDEO_CONFIG).reduce(
        (sum, s) => sum + s.durationInFrames,
        0,
      );
    const audioBaseDir = langFolder
      ? [seriesFolder, langFolder, epNum].join("/")
      : [seriesFolder, epNum].join("/");
    return {
      mod,
      dir: seriesFolder,
      lang: langFolder,
      ep,
      totalFrames,
      audioBaseDir,
    };
  })
  .filter(Boolean) as {
  mod: CompositionModule;
  dir: string;
  lang: string | null;
  ep: string;
  totalFrames: number;
  audioBaseDir: string;
}[];

// 시리즈 → 언어 2단계 그룹핑
type Entry = (typeof entries)[number];
const byFolder = entries.reduce<Record<string, Record<string, Entry[]>>>(
  (acc, e) => {
    const langKey = e.lang ?? "__none__";
    ((acc[e.dir] ??= {})[langKey] ??= []).push(e);
    return acc;
  },
  {},
);

type StudioRuntimeRefs = {
  compositionSelectorRef?: {
    current?: {
      selectComposition?: (id: string) => void;
    } | null;
  } | null;
  timeValueRef?: {
    current?: {
      seek?: (frame: number) => void;
    } | null;
  } | null;
};

const availableCompositionIds = new Set(entries.map((entry) => entry.ep));
const compositionFpsById = new Map(
  entries.map((entry) => [entry.ep, entry.mod.compositionMeta.fps]),
);
const compositionFramesById = new Map(
  entries.map((entry) => [entry.ep, entry.totalFrames]),
);

type ParsedFrameValue = {
  value: number;
  unit: "frame" | "seconds";
};

const parseFrame = (frame: string | null): ParsedFrameValue | null => {
  if (!frame) {
    return null;
  }
  const trimmed = frame.trim();
  if (!trimmed) {
    return null;
  }

  const isSeconds = /s$/i.test(trimmed);
  const raw = isSeconds ? trimmed.slice(0, -1) : trimmed;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  if (!/^-?\d*(\.\d+)?$/.test(raw)) {
    return null;
  }

  return {
    value,
    unit: isSeconds ? "seconds" : "frame",
  };
};

const toFrameNumber = (
  frameInfo: ParsedFrameValue | null,
  compositionId: string | null,
): number | null => {
  if (!frameInfo) {
    return null;
  }

  const fps = compositionId
    ? (compositionFpsById.get(compositionId) ?? 30)
    : 30;
  const frameValue =
    frameInfo.unit === "seconds" ? frameInfo.value * fps : frameInfo.value;
  const clamped = Math.max(0, Math.round(frameValue));
  const rawMaxFrame = compositionId
    ? compositionFramesById.get(compositionId)
    : null;
  const maxFrame =
    typeof rawMaxFrame === "number" && Number.isFinite(rawMaxFrame)
      ? rawMaxFrame
      : null;
  if (maxFrame == null) {
    return clamped;
  }
  return Math.min(clamped, Math.max(0, maxFrame - 1));
};

const parseDeepLinkCompositionId = (
  pathName: string,
  search: string,
): string | null => {
  const params = new URLSearchParams(search);
  const fromQuery =
    params.get("composition") ??
    params.get("id") ??
    params.get("compositionId");
  if (fromQuery) {
    return fromQuery;
  }

  const cleanedPath = pathName.replace(/\/+$/, "");
  const segments = cleanedPath.split("/").filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : null;
};

type DeepLinkFrame = {
  value: ParsedFrameValue;
  source: "search" | "hash";
};

const parseDeepLinkFrame = (
  search: string,
  hash: string,
): DeepLinkFrame | null => {
  const fromHash = parseFrame(hash.replace(/^#/, ""));
  const fromSearch = parseFrame(new URLSearchParams(search).get("frame"));

  if (fromSearch !== null) {
    return {
      value: fromSearch,
      source: "search",
    };
  }

  if (fromHash !== null) {
    return {
      value: fromHash,
      source: "hash",
    };
  }

  return null;
};

const FRAME_SYNC_DELAY_MS = 350;
const DEEP_LINK_APPLY_TIMEOUT_MS = 15000;

const getFrameFromLocation = (search: string, hash: string) => {
  const params = new URLSearchParams(search);
  const fromHash = hash.replace(/^#/, "").trim();
  const fromSearch = params.get("frame");

  if (fromSearch !== null && parseFrame(fromSearch) !== null) {
    return {
      text: fromSearch,
      source: "search",
    };
  }

  if (fromHash && parseFrame(fromHash) !== null) {
    return {
      text: fromHash,
      source: "hash",
    };
  }

  return null;
};

const updateUrlFrame = (frameText: string) => {
  const current = new URL(window.location.href);
  current.searchParams.set("frame", frameText);
  current.hash = "";

  const nextUrl = `${current.pathname}${current.search}${current.hash}`;
  window.history.replaceState({}, "", nextUrl);
};

const useStudioDeepLink = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const compositionId = parseDeepLinkCompositionId(
      window.location.pathname,
      window.location.search,
    );
    const frameInfo = parseDeepLinkFrame(
      window.location.search,
      window.location.hash,
    );
    if (frameInfo?.source === "hash") {
      const text =
        frameInfo.value.unit === "seconds"
          ? `${frameInfo.value.value}s`
          : `${frameInfo.value.value}`;
      updateUrlFrame(text);
    }

    const frame = toFrameNumber(frameInfo?.value ?? null, compositionId);
    if (!compositionId || frame === null) {
      return;
    }

    if (!availableCompositionIds.has(compositionId)) {
      return;
    }

    const refs = Internals as unknown as StudioRuntimeRefs;
    const apply = () => {
      const selector = refs.compositionSelectorRef?.current;
      const player = refs.timeValueRef?.current;

      if (!selector?.selectComposition || !player?.seek) {
        return false;
      }

      if (compositionId) {
        selector.selectComposition(compositionId);
      }
      if (frame !== null) {
        player.seek(frame);
      }
      return true;
    };

    let seekInterval: number | null = null;
    let timeout: number | null = null;
    const start = performance.now();
    apply();
    seekInterval = window.setInterval(() => {
      if (performance.now() - start > DEEP_LINK_APPLY_TIMEOUT_MS) {
        if (seekInterval) {
          window.clearInterval(seekInterval);
          seekInterval = null;
        }
        return;
      }

      apply();
    }, 80);

    timeout = window.setTimeout(() => {
      if (seekInterval) {
        window.clearInterval(seekInterval);
        seekInterval = null;
      }
    }, DEEP_LINK_APPLY_TIMEOUT_MS);

    let dragging = false;
    let queuedFrame: string | null = null;
    let pollTimer: number | null = null;
    let previousHref = window.location.href;
    let debounceTimer: number | null = null;

    const clearDebounce = () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    };

    const flushFrameUpdate = (value: string) => {
      if (!value) {
        return;
      }

      updateUrlFrame(value);
      queuedFrame = null;
    };

    const scheduleFrameUpdate = () => {
      const nextFrame = queuedFrame;
      if (!nextFrame) {
        return;
      }

      clearDebounce();
      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        flushFrameUpdate(nextFrame);
      }, FRAME_SYNC_DELAY_MS);
    };

    const syncFromLocation = () => {
      const currentHref = window.location.href;
      if (currentHref === previousHref) {
        return;
      }
      previousHref = currentHref;

      const frameValue = getFrameFromLocation(
        window.location.search,
        window.location.hash,
      );
      if (!frameValue) {
        return;
      }

      queuedFrame = frameValue.text;

      if (!dragging) {
        scheduleFrameUpdate();
      } else {
        clearDebounce();
      }
    };

    const startPolling = () => {
      if (pollTimer) {
        return;
      }
      pollTimer = window.setInterval(syncFromLocation, 80);
    };

    const stopPolling = () => {
      if (!pollTimer) {
        return;
      }
      window.clearInterval(pollTimer);
      pollTimer = null;
    };

    const onPointerDown = () => {
      dragging = true;
      clearDebounce();
      startPolling();
    };

    const onPointerUp = () => {
      dragging = false;
      if (queuedFrame) {
        scheduleFrameUpdate();
      }
    };

    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    startPolling();

    return () => {
      if (seekInterval) {
        window.clearInterval(seekInterval);
      }
      if (timeout) {
        window.clearTimeout(timeout);
      }
      clearDebounce();
      stopPolling();
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);
};

const CompItem: React.FC<{ entry: Entry }> = ({
  entry: { mod, ep, totalFrames, audioBaseDir },
}) => (
  <Composition
    key={ep}
    id={ep}
    component={() => (
      <AudioBaseDirProvider baseDir={audioBaseDir}>
        <mod.Component />
      </AudioBaseDirProvider>
    )}
    durationInFrames={totalFrames}
    fps={mod.compositionMeta.fps}
    width={mod.compositionMeta.width}
    height={mod.compositionMeta.height}
    defaultProps={{}}
  />
);

export const RemotionRoot: React.FC = () => {
  useStudioDeepLink();

  return (
    <>
      {Object.entries(byFolder).map(([series, byLang]) => (
        <Folder key={series} name={series}>
          {Object.entries(byLang).map(([lang, items]) =>
            lang === "__none__" ? (
              items.map((e) => <CompItem key={e.ep} entry={e} />)
            ) : (
              <Folder key={lang} name={lang}>
                {items.map((e) => (
                  <CompItem key={e.ep} entry={e} />
                ))}
              </Folder>
            ),
          )}
        </Folder>
      ))}
    </>
  );
};
