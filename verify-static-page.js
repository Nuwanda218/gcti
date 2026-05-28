const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(/你的“发疯人格”是哪一款？/.test(html), "page title missing");
assert((html.match(/class="question-card"/g) || []).length === 8, "expected 8 question cards");
assert((html.match(/type="radio"/g) || []).length === 32, "expected 32 radio options");
assert(/疯癫打工人/.test(html), "A result missing");
assert(/躺平型发疯/.test(html), "B result missing");
assert(/深夜emo选手/.test(html), "C result missing");
assert(/表演型发疯/.test(html), "D result missing");
assert(/<script>[\s\S]*<\/script>/.test(html), "inline script missing for static page");
assert(!/https?:\/\//.test(html), "page should not depend on remote assets");

const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sandbox = {
  window: {},
  document: {
    querySelectorAll() {
      return [];
    },
    querySelector() {
      return null;
    },
    getElementById() {
      return null;
    },
    addEventListener() {}
  }
};
vm.createContext(sandbox);
vm.runInContext(script, sandbox);

assert(typeof sandbox.window.calculateResult === "function", "calculateResult not exposed");
assert(sandbox.window.calculateResult(["A", "A", "B", "C", "D", "A", "C", "B"]).key === "A", "A scoring failed");
assert(sandbox.window.calculateResult(["B", "A", "B", "C", "D", "B", "C", "B"]).key === "B", "B scoring failed");
assert(sandbox.window.calculateResult(["C", "A", "B", "C", "D", "C", "C", "B"]).key === "C", "C scoring failed");
assert(sandbox.window.calculateResult(["D", "A", "B", "C", "D", "D", "C", "D"]).key === "D", "D scoring failed");
assert(sandbox.window.calculateResult(["A", "B", "C", "D", "A", "B", "C", "D"]).key === "A", "tie should keep earliest leading option");

console.log("static page checks passed");
