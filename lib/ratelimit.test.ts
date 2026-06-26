import { describe, it, expect, afterEach } from "vitest";
import { hasUpstashConfig } from "./ratelimit";

const URL_KEY = "UPSTASH_REDIS_REST_URL";
const TOKEN_KEY = "UPSTASH_REDIS_REST_TOKEN";

const originalUrl = process.env[URL_KEY];
const originalToken = process.env[TOKEN_KEY];

function restore(key: string, value: string | undefined) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

afterEach(() => {
  restore(URL_KEY, originalUrl);
  restore(TOKEN_KEY, originalToken);
});

describe("hasUpstashConfig", () => {
  it("is true only when both URL and token are set", () => {
    process.env[URL_KEY] = "https://example.upstash.io";
    process.env[TOKEN_KEY] = "token";
    expect(hasUpstashConfig()).toBe(true);
  });

  it("is false when the token is missing", () => {
    process.env[URL_KEY] = "https://example.upstash.io";
    delete process.env[TOKEN_KEY];
    expect(hasUpstashConfig()).toBe(false);
  });

  it("is false when the URL is missing", () => {
    delete process.env[URL_KEY];
    process.env[TOKEN_KEY] = "token";
    expect(hasUpstashConfig()).toBe(false);
  });

  it("is false when both are absent", () => {
    delete process.env[URL_KEY];
    delete process.env[TOKEN_KEY];
    expect(hasUpstashConfig()).toBe(false);
  });

  it("is false when a value is present but empty", () => {
    process.env[URL_KEY] = "";
    process.env[TOKEN_KEY] = "token";
    expect(hasUpstashConfig()).toBe(false);
  });
});
