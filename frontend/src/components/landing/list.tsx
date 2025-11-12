export const List = ({ items }: { items: string[] }) => {
  return (
    <ul className="list-disc list-inside text-muted-foreground space-y-1">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
};
