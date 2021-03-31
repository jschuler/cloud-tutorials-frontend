import * as React from "react";
import { SyncMarkdownView } from "./markdown-view";

export const EXTENSION_NAME = "quickstart";

export const removeParagraphWrap = (markdown: string) => markdown.replace(/^<p>|<\/p>$/g, '');

export type QuickStartMarkdownViewProps = {
  content: string;
  exactHeight?: boolean;
};

const QuickStartMarkdownView: React.FC<QuickStartMarkdownViewProps> = ({
  content,
  exactHeight,
}) => {
  return (
    <SyncMarkdownView
      inline
      content={content}
      exactHeight={exactHeight}
    />
  );
};
export default QuickStartMarkdownView;
