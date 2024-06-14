import { RootNavbar as Navbar } from "./_components/navbar"
import { RootFooter as Footer } from "./_components/footer"

const RootLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="min-h-full">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout