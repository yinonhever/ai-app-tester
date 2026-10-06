import { ANTHROPIC_API_URL, CLAUDE_MODEL } from "../constants";
import type { ClaudeMessagesResponse } from "../types";

/**
 * Sends a prompt (plus an optional screenshot) to Claude and returns the
 * parsed JSON response. Generic so callers get a typed result back instead
 * of `any` — e.g. askClaudeJSON<PlanningResponse>(...).
 */
export const askClaudeJSON = async <T = unknown>(
  promptText: string,
  screenshot?: Buffer
): Promise<T> => {
  const content: unknown[] = [
    {
      type: "text",
      text: promptText + "\n\nRespond with ONLY the JSON, no other text."
    }
  ];

  if (screenshot) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: "image/png",
        data: screenshot.toString("base64")
      }
    });
  }

  const { anthropicApiKey: apiKey } = useRuntimeConfig();

  let data: ClaudeMessagesResponse;
  try {
    data = await $fetch<ClaudeMessagesResponse>(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: {
        model: CLAUDE_MODEL,
        max_tokens: 8000,
        messages: [{ role: "user", content }]
      }
    });
  } catch (err: any) {
    const status = err?.status ?? err?.response?.status ?? "unknown";
    const body = err?.data
      ? JSON.stringify(err.data)
      : (err?.message ?? String(err));
    throw new Error(`Claude API error (${status}): ${body}`);
  }

  const text =
    data.content[0]?.text.trim().replace(/^```json\n?|\n?```$/g, "") ?? "";
  return extractJSON<T>(text);
};

const extractJSON = <T>(text: string): T => {
  const match = text.match(/\{[\s\S]*\}/); // grabs just the {...} part, ignoring any sentence before or after it
  if (!match) {
    throw new Error(`No JSON object found in Claude's response: ${text}`);
  }
  return JSON.parse(match[0]) as T;
};
