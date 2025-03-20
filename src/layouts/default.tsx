

import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <div className="flex items-center gap-1 text-current">
          <span className="text-default-600">Made with</span>
          <span className="text-danger" role="img" aria-label="heart">❤️</span>
          <span className="text-default-600">for Electronica informatica</span>
        </div>
      </footer>
    </div>
  );
}