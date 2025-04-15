import { Logo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"

export const MarketingFooter = () => {
  return (
    <div className="fixed bottom-0 w-full py-2 px-4 border-t bg-gray-100 dark:bg-gray-900">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="w-full flex items-center justify-end space-x-4 md:block md:w-auto">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Service Terms
          </Button>
        </div>
      </div>
    </div>
  )
}