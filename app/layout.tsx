import '../styles/globals.css'

export const metadata = {
  title: "AI text and image input",
  description: "AI ChatGPT style app with text and image input",
  icons: {
    icon: 'favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
