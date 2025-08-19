import './globals.css'
import Header from '../components/layout/header/Header'
import Footer from '../components/layout/footer/Footer'
import FetchDelayProvider from './FetchDelayProvider'
export const dynamic = 'force-dynamic';
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
        {/* Header full width */}
        <Header />

        {/* Main full width */}
        <FetchDelayProvider>
          <main className="flex-grow w-full mt-20">
            {children}
          </main>
        </FetchDelayProvider>

        {/* Footer full width */}
        <Footer />
      </body>
    </html>
  )
}
