import { Logo } from "@/components/shared/logo"
import { LocaleSwitcher } from "@/components/shared/button/locale-switcher"
import { UserButton } from "@/components/shared/button/user-button"
import { ModeToggle } from "@/components/shared/button/mode-toggle"

export const RootNavbar = () => {
  return (
    <header className="fixed top-0 w-full z-10 border-b shadow-sm bg-gray-100 dark:bg-gray-900 border-gray-500">
      <nav className="h-16 px-4 flex items-center">
        <Logo />
        <div className="ml-auto flex items-center space-x-4">
          <LocaleSwitcher />
          <UserButton />
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}