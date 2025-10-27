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
