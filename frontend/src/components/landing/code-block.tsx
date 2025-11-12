export const CodeBlock = ({ code }: { code: string }) => {
  return (
    <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto font-mono">
      {code}
    </pre>
  );
};
