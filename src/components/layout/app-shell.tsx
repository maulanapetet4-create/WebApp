type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="mx-auto min-h-screen max-w-xl bg-gray-50 px-3 py-4 text-slate-900">
      {children}
    </main>
  );
}
