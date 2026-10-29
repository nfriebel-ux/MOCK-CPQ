import "./globals.css";

export const metadata = {
  title: "CPQ System",
  description: "Configure, Price, Quote - B2B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
