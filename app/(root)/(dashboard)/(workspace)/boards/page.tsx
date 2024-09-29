import { Suspense } from "react"
import { getSubscriptionStatus } from "@/lib/actions/user-limit/get-subscription-status"

import { Separator } from "@/components/ui/separator"
import { MyBoardList } from "./_components/my-board-list"
import { SharedBoardList } from "./_components/shared-board-list"
import { Info } from "./_components/info"

const BoardsPage = async () => {
  const isPro = await getSubscriptionStatus()

  return (
    <section className="w-full mb-10">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<MyBoardList.Skeleton />}>
          <MyBoardList />
        </Suspense>
        <Suspense fallback={<SharedBoardList.Skeleton />}>
          <SharedBoardList />
        </Suspense>
      </div>
    </section>
  )
}

export default BoardsPage
