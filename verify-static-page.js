const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const htmlPath = path.join(root, "index.html");
const readmePath = path.join(root, "README.md");
const html = fs.readFileSync(htmlPath, "utf8");
const readme = fs.readFileSync(readmePath, "utf8");

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
assert(/data:image\//.test(html) || /i0\.hdslb\.com\/bfs\/emote/.test(html), "usable meme image sources missing");
for (let question = 1; question <= 8; question += 1) {
  assert(fs.existsSync(path.join(root, "assets", "memes", `q${question}`)), `q${question} meme directory missing`);
}
assert(fs.existsSync(path.join(root, "assets", "memes", "results")), "result meme directory missing");
assert(/assets\/memes\/q\[题号\]\/\[选项\]\.png/.test(readme), "README question naming rule missing");
assert(/assets\/memes\/results\/\[人格选项\]\.png/.test(readme), "README result naming rule missing");

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
