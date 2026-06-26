import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";

/** Renders trusted, local Markdown content with SEEK-styled typography. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("space-y-4 text-[15px] leading-relaxed text-ink-secondary", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node: _node, ...props }) => (
            <h1 className="text-2xl font-bold text-seek-navy" {...props} />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2 className="mt-6 text-lg font-semibold text-seek-navy" {...props} />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3 className="mt-4 text-base font-semibold text-seek-navy" {...props} />
          ),
          p: ({ node: _node, ...props }) => <p {...props} />,
          ul: ({ node: _node, ...props }) => (
            <ul className="list-disc space-y-1.5 pl-5 marker:text-seek-pink" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal space-y-1.5 pl-5" {...props} />
          ),
          li: ({ node: _node, ...props }) => <li className="pl-1" {...props} />,
          a: ({ node: _node, ...props }) => (
            <a className="font-medium text-seek-pink hover:underline" {...props} />
          ),
          strong: ({ node: _node, ...props }) => (
            <strong className="font-semibold text-seek-navy" {...props} />
          ),
          em: ({ node: _node, ...props }) => <em className="text-ink-muted" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
