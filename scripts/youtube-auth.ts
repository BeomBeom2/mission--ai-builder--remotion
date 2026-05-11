// scripts/youtube-auth.ts
import { existsSync, readFileSync, writeFileSync } from "fs";
import { google } from "googleapis";
import http from "http";
import open from "open";
import path from "path";

const TOKEN_PATH = path.resolve("token.json");
const CLIENT_PATH = path.resolve("client.json");
const SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.force-ssl",
];
const PORT = 8070;
const AUTH_TIMEOUT_MS = 600_000;

export async function getYouTubeClient() {
  if (!existsSync(CLIENT_PATH)) {
    throw new Error(
      "client.json 없음 — Google Cloud Console에서 OAuth 인증 정보를 다운로드하세요.",
    );
  }
  const clientJson = JSON.parse(readFileSync(CLIENT_PATH, "utf-8"));
  const { client_id, client_secret, redirect_uris } = clientJson.web;

  const oauth2 = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  );

  oauth2.on("tokens", (tokens) => {
    const existing = existsSync(TOKEN_PATH)
      ? JSON.parse(readFileSync(TOKEN_PATH, "utf-8"))
      : {};
    writeFileSync(
      TOKEN_PATH,
      JSON.stringify({ ...existing, ...tokens }, null, 2),
    );
  });

  if (existsSync(TOKEN_PATH)) {
    const tokens = JSON.parse(readFileSync(TOKEN_PATH, "utf-8"));
    oauth2.setCredentials(tokens);
    return google.youtube({ version: "v3", auth: oauth2 });
  }

  const authUrl = oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  const code = await new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      server.close();
      reject(new Error("인증 타임아웃 (2분). 다시 시도해주세요."));
    }, AUTH_TIMEOUT_MS);
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url!, `http://localhost:${PORT}`);
      const code = url.searchParams.get("code");
      if (code) {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("인증 완료! 이 창을 닫아도 됩니다.");
        clearTimeout(timer);
        server.close();
        resolve(code);
      } else {
        res.end("인증 코드가 없습니다.");
      }
    });
    server.listen(PORT, () => {
      console.log(`🔐  브라우저에서 Google 로그인을 진행해주세요…`);
      open(authUrl);
    });
  });

  const { tokens } = await oauth2.getToken(code);
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  oauth2.setCredentials(tokens);

  return google.youtube({ version: "v3", auth: oauth2 });
}
