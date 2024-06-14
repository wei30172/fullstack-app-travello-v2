import { Logo } from "@/components/shared/logo"
import { UserButton } from "@/components/shared/button/user-button"
import { ModeToggle } from "@/components/shared/button/mode-toggle"
// import { Navlinks } from "./nav-links"

export const RootNavbar = () => {
  return (
    <header className="fixed top-0 w-full z-10 border-b shadow-sm bg-gray-100 dark:bg-gray-900 border-gray-500">
      <nav className="h-16 px-4 flex items-center">
        <Logo />
        {/* <Navlinks /> */}
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}