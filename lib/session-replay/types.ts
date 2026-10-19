import type { eventWithTime } from "@rrweb/types";

export type ReplayEvent = eventWithTime;
export type ReplaySession = {
  id: string;
  visitor_id: string;
  session_id: string;
  path: string;
  started_at: string;
  updated_at: string;
  event_count: number;
};
export const REPLAY_CONSENT_KEY = "ruff_replay_consent_v1";
export function isReplayPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//") && !/[?#]/.test(path)
    && !/(?:behavioral-intelligence|analytics|admin|content-editor|brief|30-min|api|outils-gratuits)(?:\/|$)/i.test(path);
}
