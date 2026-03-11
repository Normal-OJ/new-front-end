import { describe, it, expect } from "vitest";
import renderMarkdown from "./renderMarkdown";

// ─── XSS protection ───────────────────────────────────────────────────────────
//
// renderMarkdown must never produce live HTML elements from untrusted input.

describe("XSS protection", () => {
  it("raw <script> tag is escaped as text by markdown-it, never executed", () => {
    const result = renderMarkdown("<script>alert(1)</script>");
    expect(result).not.toContain("<script>"); // no live element
    expect(result).toContain("&lt;script&gt;"); // present only as escaped text
  });

  it("<script> inside code fence is shown as visible text, not executed", () => {
    const result = renderMarkdown("```\n<script>alert(1)</script>\n```");
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("raw <img onerror=...> is escaped as text — no live element, onerror cannot fire", () => {
    const result = renderMarkdown('<img src=x onerror="alert(1)">');
    expect(result).not.toContain("<img"); // no live img element
    expect(result).toContain("&lt;img"); // escaped as text by markdown-it
  });

  it("raw <a href=javascript:...> is escaped as text — no live link", () => {
    const result = renderMarkdown('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain("<a href"); // no live anchor
    expect(result).toContain("&lt;a"); // escaped as text by markdown-it
  });
});

// ─── Backward compatibility: old escaped data == new raw data ─────────────────
//
// The backend used to call html.escape() on markdown fields before saving to
// MongoDB (Back-End PR #323: https://github.com/Normal-OJ/Back-End/pull/323).
// That escape is being removed so raw markdown is stored instead.
// Old data (e.g. "a &lt; b") and new data (e.g. "a < b") must render identically.

describe("old escaped data renders identically to new raw data", () => {
  it("< character", () => {
    expect(renderMarkdown("a < b")).toBe(renderMarkdown("a &lt; b"));
  });

  it("> character", () => {
    expect(renderMarkdown("a > b")).toBe(renderMarkdown("a &gt; b"));
  });

  it("& character", () => {
    expect(renderMarkdown("AT&T")).toBe(renderMarkdown("AT&amp;T"));
  });

  it("double-quote character", () => {
    expect(renderMarkdown('say "hello"')).toBe(renderMarkdown("say &quot;hello&quot;"));
  });

  it("mixed special chars in a realistic problem description", () => {
    const raw = 'Given n integers where 1 ≤ n ≤ 10^5 and a < b & b > c, output "YES" or "NO".';
    const escaped =
      "Given n integers where 1 ≤ n ≤ 10^5 and a &lt; b &amp; b &gt; c, output &quot;YES&quot; or &quot;NO&quot;.";
    expect(renderMarkdown(raw)).toBe(renderMarkdown(escaped));
  });
});

// ─── Content correctness: markdown features still work after the change ────────

describe("markdown rendering", () => {
  it("renders bold", () => {
    expect(renderMarkdown("**bold**")).toContain("<strong>bold</strong>");
  });

  it("renders inline code", () => {
    expect(renderMarkdown("`code`")).toContain("<code>code</code>");
  });

  it("renders fenced code block", () => {
    expect(renderMarkdown("```\nhello\n```")).toContain("<pre>");
  });

  it("renders links", () => {
    expect(renderMarkdown("[link](https://example.com)")).toContain('href="https://example.com"');
  });
});
