import { Suspense } from "react"
import { MyBoardList } from "./_components/my-board-list"
import { SharedBoardList } from "./_components/shared-board-list"

const BoardsPage = () => {
  return (
    <section className="w-full mb-10">
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
