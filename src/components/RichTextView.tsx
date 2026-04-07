interface Props {
  html: string;
  className?: string;
}

// Backward-compatible: plain text (no HTML tags) renders as-is
export function RichTextView({ html, className }: Props) {
  if (!html.includes('<')) {
    return <span className={className}>{html}</span>;
  }
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
