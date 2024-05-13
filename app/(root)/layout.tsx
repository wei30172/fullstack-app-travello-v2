import { RootNavbar as Navbar } from "./_components/navbar"
import { RootFooter as Footer } from "./_components/footer"

const RootLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <Navbar />
      <main className="h-full">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default RootLayout