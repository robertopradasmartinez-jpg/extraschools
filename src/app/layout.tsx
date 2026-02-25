import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';
import SessionProvider from '@/components/providers/SessionProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import messages from '../../messages/es.json';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://extraschools.es'),
  title: {
    default: "ExtraSchools - Actividades Extraescolares en España",
    template: "%s | ExtraSchools"
  },
  description: "Encuentra las mejores actividades extraescolares para tus hijos en España. Deportes, música, idiomas, arte y más. Compara precios y reserva online.",
  keywords: [
    'actividades extraescolares',
    'extraescolares España',
    'clases para niños',
    'deportes infantiles',
    'música para niños',
    'idiomas niños',
    'actividades después del colegio',
    'extraschools',
    'actividades educativas'
  ],
  authors: [{ name: 'ExtraSchools' }],
  creator: 'ExtraSchools',
  publisher: 'ExtraSchools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://extraschools.es',
    siteName: 'ExtraSchools',
    title: 'ExtraSchools - Actividades Extraescolares en España',
    description: 'Encuentra las mejores actividades extraescolares para tus hijos. Deportes, música, idiomas, arte y más.',
    images: [
      {
        url: '/extraschools-logo.png',
        width: 1200,
        height: 630,
        alt: 'ExtraSchools - Actividades Extraescolares',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExtraSchools - Actividades Extraescolares',
    description: 'Encuentra las mejores actividades extraescolares para tus hijos en España',
    images: ['/extraschools-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Añadir cuando tengas las claves de verificación
    // google: 'tu-codigo-de-verificacion',
    // yandex: 'tu-codigo-de-verificacion',
    // bing: 'tu-codigo-de-verificacion',
  },
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
        <NextTopLoader
          color="#f43f5e"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #f43f5e,0 0 5px #f43f5e"
        />
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
