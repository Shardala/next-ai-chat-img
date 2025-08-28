import { aiChatDescription, aiChatTitle } from './consts';
import '../styles/globals.css'

export const metadata = {
  title: aiChatTitle,
  description: aiChatDescription,
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
