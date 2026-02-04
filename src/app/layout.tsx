import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import SessionProvider from '@/components/providers/SessionProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import messages from '../../messages/es.json';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExtraSchools - Actividades Extraescolares",
  description: "Marketplace de actividades extraescolares en España",
  icons: {
    icon: [
      { url: '/favicon.ico?v=2' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
  },
  other: {
    'msapplication-TileColor': '#00A3FF',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <NextIntlClientProvider locale="es" messages={messages}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
