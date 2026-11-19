import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastNotification } from '@/components/ToastNotification';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { CartDrawer } from '@/components/CartDrawer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BINARY.BITE — One Bite, Endless Happiness! | Stand Kelas 12B',
  description:
    'Website pemesanan makanan dan minuman resmi BINARY.BITE kelas 12B untuk acara Jumat, 27 November 2026. Kue Lipat, Sus Buah, Roll Abon, Es Gabin, dan Es Capcin segar!',
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
  ],
  authors: [{ name: 'Kelas 12B — BINARY.BITE' }],
  openGraph: {
    title: 'BINARY.BITE — One Bite, Endless Happiness!',
    description:
      'Pesan camilan manis, gurih, dan minuman segar spesial dari Stand Kelas 12B untuk acara Jumat, 27 November 2026.',
    url: 'https://binary-bite.vercel.app',
    siteName: 'BINARY.BITE',
    images: [
      {
        url: '/images/stand-menu.jpg',
        width: 1080,
        height: 1080,
        alt: 'Menu Stand BINARY.BITE',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-brand-white text-brand-slate font-sans antialiased selection:bg-brand-sky selection:text-brand-cobalt">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ToastNotification />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}

