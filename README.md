n# 发疯人格问卷

一个基于《问卷设计.md》制作的纯静态网页问卷。页面包含 8 道选择题，选择完成后会统计 A、B、C、D 出现次数，并给出对应的“发疯人格”结果。

## 在线/本地使用

直接打开 `index.html` 即可使用，不需要安装依赖，也不需要启动服务器。

## 问卷结果

- A 最多：疯癫打工人
- B 最多：躺平型发疯
- C 最多：深夜 emo 选手
- D 最多：表演型发疯

## 文件说明

- `index.html`：静态问卷页面，包含 HTML、CSS 和 JavaScript。
- `assets/memes/`：本地表情包图片目录。
- `verify-static-page.js`：静态页面验收脚本，用于检查题目数量、选项数量、结果文案和计分逻辑。

原始问卷、文档和演示稿为本地资料文件，不上传到仓库。

## 表情包命名规范

题目选项图放在 `assets/memes/q[题号]/[选项].png`。

题号从 `q1` 到 `q8`，选项固定为大写 `A`、`B`、`C`、`D`。每道题放 4 张图：

```text
assets/memes/q1/A.png
assets/memes/q1/B.png
assets/memes/q1/C.png
assets/memes/q1/D.png
...
assets/memes/q8/A.png
assets/memes/q8/B.png
assets/memes/q8/C.png
assets/memes/q8/D.png
```

结果页人格图放在 `assets/memes/results/[人格选项].png`：

```text
assets/memes/results/A.png
assets/memes/results/B.png
assets/memes/results/C.png
assets/memes/results/D.png
assets/memes/results/MIX.png
```

`A.png` 对应“疯癫打工人”，`B.png` 对应“躺平型发疯”，`C.png` 对应“深夜 emo 选手”，`D.png` 对应“表演型发疯”，`MIX.png` 对应并列最高时的“复合型发疯”。

图片建议使用 PNG 格式，文件名必须大写。代码会优先读取这些本地图片；如果某张图片暂时没放进去，会自动回退到线上备用表情。

## 验证

本地可运行：

```bash
node verify-static-page.js
```

看到 `static page checks passed` 表示页面结构和核心计分逻辑通过检查。
