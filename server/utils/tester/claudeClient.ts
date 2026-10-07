import { ANTHROPIC_API_URL, CLAUDE_MODEL } from "../constants";
import type { ClaudeMessagesResponse } from "../types";
import { delay } from "../functions";

const MAX_ATTEMPTS = 3;
const NON_RETRYABLE_STATUSES = new Set([400, 401, 403, 404, 422]);

/**
 * Shared request logic: sends a prompt (plus an optional screenshot) to
 * Claude, retries on transient failures, and returns the raw text response.
 * Both askClaudeJSON and askClaudeText build on this.
 */
const callClaude = async (
  promptText: string,
  screenshot?: Buffer
): Promise<string> => {
  const content: unknown[] = [{ type: "text", text: promptText }];

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

  let data: ClaudeMessagesResponse | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
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
      break;
    } catch (err: any) {
      const status = err?.status;
      const isRetryable = !status || !NON_RETRYABLE_STATUSES.has(status);

      if (isRetryable && attempt < MAX_ATTEMPTS) {
        console.log(
          `Claude request failed (${status ?? "network error"}), retrying (attempt ${attempt + 1}/${MAX_ATTEMPTS})...`
        );
        await delay(2000 * attempt);
        continue;
      }

      const body = err?.data
        ? JSON.stringify(err.data)
        : (err?.message ?? String(err));
      throw new Error(`Claude API error (${status ?? "unknown"}): ${body}`);
    }
  }

  if (!data) {
    throw new Error("Claude API error: no response received after retries");
  }

  return data.content[0]?.text.trim() ?? "";
};

/**
 * Sends a prompt (plus an optional screenshot) to Claude and returns the
 * parsed JSON response. Generic so callers get a typed result back instead
 * of `any` — e.g. askClaudeJSON<PlanningResponse>(...).
 */
export const askClaudeJSON = async <T = unknown>(
  promptText: string,
  screenshot?: Buffer,
  jsonRetries = 2
): Promise<T> => {
  const fullPrompt =
    promptText +
    "\n\nRespond with ONLY the JSON, no other text. If any text value " +
    "would contain a double-quote character, omit it or rephrase instead " +
    "of including it literally.";

  for (let attempt = 1; attempt <= jsonRetries; attempt++) {
    const text = await callClaude(fullPrompt, screenshot);
    const cleaned = text.replace(/^```json\n?|\n?```$/g, "");

    try {
      return extractJSON<T>(cleaned);
    } catch (err) {
      if (attempt === jsonRetries) throw err;
      console.log(
        `JSON parse failed, retrying (attempt ${attempt + 1}/${jsonRetries})...`
      );
    }
  }

  // Unreachable: the loop above always either returns or throws on its
  // final attempt. This satisfies TypeScript's control-flow analysis,
  // which can't prove that on its own.
  throw new Error("askClaudeJSON: exhausted retries without resolving");
};

/**
 * Sends a prompt (plus an optional screenshot) to Claude and returns the
 * raw text response, unparsed — for prompts that ask for plain text
 * rather than JSON (e.g. a one-sentence answer, or NONE).
 */
export const askClaudeText = async (
  promptText: string,
  screenshot?: Buffer
): Promise<string> => {
  return callClaude(promptText, screenshot);
};

const extractJSON = <T>(text: string): T => {
  const match = text.match(/\{[\s\S]*\}/); // grabs just the {...} part, ignoring any sentence before or after it
  if (!match) {
    throw new Error(`No JSON object found in Claude's response: ${text}`);
  }
  return JSON.parse(match[0]) as T;
};
