import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'QL Notes',
    description: 'QL Notes -- Russell Feathers'
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }
  