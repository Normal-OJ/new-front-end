import DOMPurify from "dompurify";
import tm from "markdown-it-texmath";
import markdownIt from "markdown-it";
import katex from "katex";
import hljs from "highlight.js";

const md = markdownIt({
  html: false,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, { language: lang }).value;
    }
    return str;
  },
}).use(tm, {
  engine: katex,
  delimiters: "dollars",
  katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
});

export default function renderMarkdown(markdown: string): string {
  return DOMPurify.sanitize(md.render(markdown));
}
