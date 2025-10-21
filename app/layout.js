export const metadata = {
  title: 'Shypram Catalogue',
  description: 'Premium rubber products catalogue',
  metadataBase: new URL('http://localhost:3001'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}