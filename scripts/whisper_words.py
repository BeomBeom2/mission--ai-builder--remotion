#!/usr/bin/env python3
"""
faster-whisper로 mp3에서 단어별 타임스탬프 추출
Usage: python scripts/whisper_words.py <audio_file>
Output: JSON array of {"start": float, "end": float, "word": str}
"""
import sys, json
from faster_whisper import WhisperModel

if len(sys.argv) < 2:
    print("Usage: whisper_words.py <audio_file>", file=sys.stderr)
    sys.exit(1)

audio_file = sys.argv[1]
try:
    model = WhisperModel("small", device="cpu", compute_type="int8")
    segments, _ = model.transcribe(audio_file, language="ko", word_timestamps=True)

    words = []
    segs = []
    for segment in segments:
        segs.append({"start": segment.start, "end": segment.end})
        if segment.words:
            for word in segment.words:
                words.append({"start": word.start, "end": word.end, "word": word.word})

    # {"segments": [...], "words": [...]} 형식으로 출력
    # segments: Whisper가 자연 경계로 분할한 구/문장 단위 (단어보다 신뢰도 높음)
    print(json.dumps({"segments": segs, "words": words}, ensure_ascii=False))
except Exception as e:
    print(f"whisper error: {e}", file=sys.stderr)
    print("[]")
    sys.exit(1)
