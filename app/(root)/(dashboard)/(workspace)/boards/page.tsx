import { Suspense } from "react"
import { BoardList } from "./_components/board-list"

const BoardsPage = () => {
  return (
    <section className="w-full mb-20">
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </section>
  )
}

export default BoardsPage
