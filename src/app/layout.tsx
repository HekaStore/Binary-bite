import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastNotification } from '@/components/ToastNotification';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { Watermark } from '@/components/Watermark';
import { CartDrawer } from '@/components/CartDrawer';
import { MaintenanceGuard } from '@/components/MaintenanceGuard';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://binarybite.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BINARY.BITE: Stand Kuliner Kelas 12B | One Bite, Endless Happiness!',
  description:
    'Website pemesanan resmi BINARY.BITE Kelas 12B (27 s/d 29 November 2026). Sajian aneka kue lezat, kudapan renyah, dan minuman segar mulai Rp3.000 s/d Rp9.000.',
  keywords: [
    'Binary Bite',
    'Stand 12B',
    'PKWU',
    'Kue Lipat',
    'Sus Buah',
    'Roll Abon',
    'Es Gabin',
    'Es Capcin',
    'Kuliner Sekolah',
    'Lumajang',
  ],
  authors: [{ name: 'Kelas 12B, BINARY.BITE' }],
  icons: {
    icon: '/images/logo.jpg',
    apple: '/images/logo.jpg',
  },
  openGraph: {
    title: 'BINARY.BITE: Stand Kuliner Kelas 12B | One Bite, Endless Happiness!',
    description:
      'Sajian aneka kue lezat, kudapan renyah, dan minuman segar spesial Stand Kelas 12B (27 s/d 29 Nov 2026). Pesan online sekarang (Rp3.000 s/d Rp9.000)!',
    url: siteUrl,
    siteName: 'BINARY.BITE',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BINARY.BITE: Stand Kuliner Kelas 12B - One Bite, Endless Happiness!',
      },
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BINARY.BITE: Stand Kuliner Kelas 12B - One Bite, Endless Happiness!',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BINARY.BITE: Stand Kuliner Kelas 12B | One Bite, Endless Happiness!',
    description:
      'Sajian aneka kue lezat, kudapan renyah, dan minuman segar spesial Stand Kelas 12B (27 s/d 29 Nov 2026). Pesan online sekarang (Rp3.000 s/d Rp9.000)!',
    images: ['/images/og-image.jpg'],
  },
  other: {
    'page-type': 'place',
    'site-kind': 'other',
    'page-kind': 'place',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-type="place" data-radius="soft" data-motion="true" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-white text-brand-slate font-sans antialiased selection:bg-brand-sky selection:text-brand-cobalt">
        <CartProvider>
          <MaintenanceGuard>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <FloatingWhatsApp />
          </MaintenanceGuard>
          <ToastNotification />
          <Watermark />
        </CartProvider>
      </body>
    </html>
  );
}
