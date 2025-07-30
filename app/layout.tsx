import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Timedrop Admin Dashboard',
  description:
    'A modern, professional admin dashboard for managing the Timedrop platform. Features secure authentication, analytics, user and market management, wallet and portfolio tools, responsive design, and seamless dark/light mode. Built with Next.js, React, and Tailwind CSS.',
  generator: 'Next.js, v0.dev',
  keywords: [
    'Admin Dashboard',
    'Timedrop',
    'Next.js',
    'React',
    'Tailwind CSS',
    'JWT',
    'Analytics',
    'User Management',
    'Market Management',
    'Wallets',
    'Portfolios',
    'Dark Mode',
    'Light Mode',
    'Professional UI',
    'Responsive Design',
  ],
  authors: [{ name: 'Your Name or Team' }],
  creator: 'Your Name or Team',
  themeColor: '#0f172a', // Example: Tailwind slate-900, adjust as needed
  openGraph: {
    title: 'Timedrop Admin Dashboard',
    description:
      'Powerful admin tools for the Timedrop platform. Manage users, markets, wallets, and more with a beautiful, responsive interface.',
    url: 'https://timedrop-admin.vercel.app', // Replace with your actual URL
    siteName: 'Timedrop Admin',
    images: [
      {
        url: '/placeholder-logo.png', // Replace with your logo or OG image
        width: 1200,
        height: 630,
        alt: 'Timedrop Admin Dashboard',
      },
    ],
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#fff",
              fontSize: "1rem",
              borderRadius: "0.5rem",
            }
          }}
        />
      </body>
    </html>
  )
}
