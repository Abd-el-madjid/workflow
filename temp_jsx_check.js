const fs = require("fs");
const path = "src/app/components/DashboardLayout.tsx";
const text = fs.readFileSync(path, "utf8");
const tagRe =
  /<\s*([a-zA-Z][a-zA-Z0-9]*)\b|<\s*\/\s*([a-zA-Z][a-zA-Z0-9]*)\s*>/g;
const stack = [];
let match;
while ((match = tagRe.exec(text))) {
  const [full, open, close] = match;
  if (
    open &&
    !full.endsWith("/>") &&
    !/\/.+>$/.test(full) &&
    open !== "br" &&
    open !== "img" &&
    open !== "hr" &&
    open !== "input" &&
    open !== "meta" &&
    open !== "link"
  ) {
    stack.push({ tag: open, index: match.index });
  }
  if (close) {
    if (stack.length === 0) {
      console.log("Extra close", close, "at", match.index);
      break;
    }
    const top = stack.pop();
    if (top.tag !== close) {
      console.log(
        "Mismatch close",
        close,
        "expected",
        top.tag,
        "at",
        match.index,
      );
      break;
    }
  }
}
console.log("stack length", stack.length);
console.log(stack.slice(-10));
