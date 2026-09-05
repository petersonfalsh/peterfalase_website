import "./globals.css";

export const metadata = {
  title: "Peter Falase — Systems, automation & digital operations",
  description:
    "The professional portfolio of Peter Falase, an IT and digital operations professional building clearer systems for complex work.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
