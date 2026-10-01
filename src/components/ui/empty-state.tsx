type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <li className="rounded-xl bg-white p-4 text-base text-gray-500 shadow-sm">
      {message}
    </li>
  );
}
