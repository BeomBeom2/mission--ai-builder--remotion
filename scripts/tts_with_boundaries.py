#!/usr/bin/env python3
"""
TTS 생성 + Word Boundary 이벤트 추출.
사용법: python tts_with_boundaries.py <voice> <rate> <text> <output_mp3>
stdout: JSON 배열 [{ "text": str, "offset": int, "duration": int }, ...]
  offset/duration 단위: 100ns 틱 (÷ 10_000_000 → 초)
"""
import asyncio, sys, json
import edge_tts

async def main() -> None:
    voice, rate, text, out_file = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    communicate = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    chunks: list[bytes] = []
    boundaries: list[dict] = []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            chunks.append(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            boundaries.append({
                "text":     chunk["text"],
                "offset":   chunk["offset"],    # 100ns 틱
                "duration": chunk["duration"],  # 100ns 틱
            })
    with open(out_file, "wb") as f:
        f.write(b"".join(chunks))
    print(json.dumps(boundaries, ensure_ascii=False))

asyncio.run(main())
