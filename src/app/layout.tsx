import Navbar from "../components/layout/Navbar";
import AppProviders from "../components/providers/AppProviders";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AppProviders>
          <Navbar />
          <div className="mx-auto max-w-3xl px-4 py-6 pb-10">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
