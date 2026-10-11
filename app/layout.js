import './globals.css';

export const metadata = {
  title: 'Girls Day Experience',
  description: 'Premium bilingual Girls Day celebration experience',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
