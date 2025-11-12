export const LinkItem = ({
  label,
  url,
  icon,
}: {
  label: string;
  url: string;
  icon?: string;
}) => {
  return (
    <li>
      {icon && <span>{icon} </span>}
      <strong>{label}: </strong>
      <a
        href={url}
        className="text-blue-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>
    </li>
  );
};
