type PageTitleProps = {
  title: string;
  description?: string;
};

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <header className="mb-4">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </header>
  );
}
