/**
 * rehype plugin: CJK Bold/Italic Fix
 *
 * CommonMark 규칙상 `**text)**한국어` 처럼 닫는 `**` 앞에 구두점이 있고
 * 뒤에 한국어(CJK) 문자가 바로 오면 right-flanking delimiter로 인식되지 않아
 * bold 변환이 실패합니다. 이 플러그인은 렌더링 후 HTML에서 남은
 * `**...**` 패턴을 `<strong>` 태그로 변환합니다.
 */
import { visit } from "unist-util-visit";
import type { Root, Text, Element } from "hast";

export function rehypeCjkBoldFix() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (
        typeof node.value !== "string" ||
        !node.value.includes("**") ||
        index === undefined ||
        !parent
      )
        return;

      const regex = /\*\*(.+?)\*\*/gs;
      if (!regex.test(node.value)) return;
      regex.lastIndex = 0;

      const value = node.value;
      const newChildren: (Text | Element)[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(value)) !== null) {
        if (match.index > lastIndex) {
          newChildren.push({
            type: "text",
            value: value.slice(lastIndex, match.index),
          });
        }
        newChildren.push({
          type: "element",
          tagName: "strong",
          properties: {},
          children: [{ type: "text", value: match[1] }],
        });
        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < value.length) {
        newChildren.push({ type: "text", value: value.slice(lastIndex) });
      }

      if (
        newChildren.length > 1 ||
        (newChildren.length === 1 && newChildren[0].type === "element")
      ) {
        (parent as Element).children.splice(index, 1, ...newChildren);
        return [true, index + newChildren.length] as const;
      }
    });
  };
}
