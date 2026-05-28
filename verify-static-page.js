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
assert(/id="optionGrid"/.test(html), "Zhao design option grid missing");
assert(/id="resultView"/.test(html), "Zhao design result view missing");
assert(/const questions = \[/.test(html), "dynamic question data missing");
assert(/const memeSets = \{/.test(html), "meme image sets missing");
assert(!/media\.tenor\.com/.test(html), "Tenor links should be replaced");
assert(!/tenor\.com\/search/.test(html), "Tenor attribution links should be replaced");
assert(/i0\.hdslb\.com\/bfs\/emote/.test(html), "domestic Bilibili emote links missing");
assert((html.match(/https:\/\/i0\.hdslb\.com\/bfs\/emote\//g) || []).length >= 24, "expected domestic meme image coverage");

const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sandbox = {
  window: {},
  document: {
    getElementById() {
      return {
        addEventListener() {},
        classList: { add() {}, remove() {}, toggle() {} },
        setAttribute() {},
        appendChild() {},
        append() {},
        style: {},
        dataset: {},
        textContent: "",
        innerHTML: "",
        src: "",
        alt: ""
      };
    },
    createElement() {
      return {
        addEventListener() {},
        querySelector() {
          return { addEventListener() {} };
        },
        classList: { add() {}, remove() {}, toggle() {} },
        setAttribute() {},
        appendChild() {},
        append() {},
        style: {},
        dataset: {},
        textContent: "",
        innerHTML: ""
      };
    },
    querySelectorAll() {
      return [];
    }
  },
  setTimeout(fn) {
    if (typeof fn === "function") fn();
  }
};
vm.createContext(sandbox);
vm.runInContext(script, sandbox);

console.log("static page checks passed");
