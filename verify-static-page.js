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
assert(/pick/i.test(html), "pick page content marker missing");
assert(!/media\.tenor\.com/.test(html), "Tenor links should be replaced");
assert(!/tenor\.com\/search/.test(html), "Tenor attribution links should be replaced");
assert(!/data:image\//.test(html), "embedded base64 images should be split into asset files");
assert(fs.statSync(htmlPath).size < 1024 * 1024, "index.html should stay under 1MB");
assert((html.match(/assets\/memes\/pick\/q\d\/[ABCD]\.(?:gif|webp|png|jpe?g)/g) || []).length === 32, "pick page should reference 32 split question images");
for (let question = 1; question <= 8; question += 1) {
  assert(fs.existsSync(path.join(root, "assets", "memes", "pick", `q${question}`)), `pick q${question} meme directory missing`);
  for (const choice of ["A", "B", "C", "D"]) {
    const dir = path.join(root, "assets", "memes", "pick", `q${question}`);
    const matches = fs.readdirSync(dir).filter((name) => new RegExp(`^${choice}\\.(gif|webp|png|jpe?g)$`, "i").test(name));
    assert(matches.length === 1, `pick ${question}/${choice} meme image missing`);
    assert(fs.statSync(path.join(dir, matches[0])).size > 0, `pick ${question}/${choice} meme image is empty`);
  }
}
assert(fs.existsSync(path.join(root, "assets", "memes", "results")), "result meme directory missing");
assert(/assets\/memes\/q\[题号\]\/\[选项\]\.png/.test(readme), "README question naming rule missing");
assert(/assets\/memes\/results\/\[人格选项\]\.png/.test(readme), "README result naming rule missing");

const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const sandbox = {
  window: {
    setTimeout(fn) {
      if (typeof fn === "function") fn();
      return 1;
    },
    clearTimeout() {},
    matchMedia() {
      return { matches: true };
    },
    setInterval() {
      return 1;
    },
    clearInterval() {}
  },
  document: {
    getElementById() {
      return {
        addEventListener() {},
        classList: { add() {}, remove() {}, toggle() {} },
        setAttribute() {},
        appendChild() {},
        append() {},
        style: { setProperty() {} },
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
        style: { setProperty() {} },
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
  },
  setInterval() {
    return 1;
  },
  clearInterval() {}
};
vm.createContext(sandbox);
vm.runInContext(script, sandbox);

console.log("static page checks passed");
