import './globals.css'
import Header from '../components/layout/header/Header'
import Footer from '../components/layout/footer/Footer'

export const metadata = {
  title: 'TOREDCO',
  description: 'TOREDCO Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 mt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
