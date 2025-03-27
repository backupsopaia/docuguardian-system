
import React from 'react';
import { ClipboardIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  language?: string;
  value: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language = 'javascript',
  value,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative group', className)}>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm">
        <code className={`language-${language}`}>{value}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Copy code"
      >
        {copied ? (
          <CheckIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ClipboardIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};
