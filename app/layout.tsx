import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { AuthProvider } from '@/lib/auth-context';
import { AnalyticsHead } from '@/components/site/analytics-head';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://phodijon.fr'),
  title: 'PHỞ Dijon — Restaurant Vietnamien Authentique à Dijon',
  description:
    "Découvrez l'authentique cuisine vietnamienne au cœur de Dijon. Pho traditionnel, bun, banh mi et bien plus, préparés avec un bouillon d'os mijoté 24 heures et les meilleurs ingrédients. Réservez votre table dès aujourd'hui.",

  keywords: [
    'restaurant vietnamien Dijon',
    'pho Dijon',
    'cuisine vietnamienne authentique',
    'banh mi Dijon',
    'restaurant asiatique Dijon',
    'PHỞ Dijon',
  ],

  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },

  openGraph: {
    title: 'PHỞ Dijon — Restaurant Vietnamien Authentique',
    description:
      "Cuisine vietnamienne authentique au cœur de Dijon. Pho, bun, banh mi et bien plus.",
    type: 'website',
    locale: 'fr_FR',
    siteName: 'PHỞ Dijon',
    images: [
  {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'PHỞ Dijon - Restaurant Vietnamien Authentique',
  },
],
  },

  twitter: {
  card: 'summary_large_image',
  title: 'PHỞ Dijon — Restaurant Vietnamien Authentique',
  description:
    "Découvrez l'authentique cuisine vietnamienne au cœur de Dijon.",
  images: ['/og-image.png'],
},
};

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'PHỞ Dijon',
  cuisine: 'Vietnamienne',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '8 Rue des Perrières',
    addressLocality: 'Dijon',
    postalCode: '21000',
    addressCountry: 'FR',
  },
  telephone: '+33 3 80 42 06 34',
  openingHours: 'Mo-Su 11:30-22:00',
  priceRange: '€€',
  servesCuisine: 'Vietnamienne',
  acceptsReservations: 'True',
  menu: '/menu',
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 47.3220,
    longitude: 5.0310,
  },
  url: 'https://pho-dijon-restaurant.netlify.app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-sans`}>
        <AuthProvider>
          <AnalyticsHead />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
