import { Suspense } from "react"
import { BoardRole } from "@/lib/models/types"
import { getLists } from "@/lib/actions/list/get-lists"

import { ReadOnlyListContainer } from "./_components/read-only-list-container"
import { ListContainer } from "./_components/list-container"

interface BoardIdPageProps {
  params: {
    boardId: string
  }
}

const BoardIdPage = async ({
  params,
}: BoardIdPageProps) => {
  return (
    <section className="p-4 h-full overflow-x-auto">
       <Suspense fallback={<BoardContent.Skeleton />}>
        <BoardContent params={params} />
      </Suspense>
    </section>
  )
}

const BoardContent = async ({ params }: BoardIdPageProps) => {
  const res = await getLists(params.boardId)

  if (("error" in res)) {
    return <div>Error loading lists: {res.error}</div>;
  }

  return res.role === BoardRole.VIEWER ? (
    <ReadOnlyListContainer data={res.data} role={res.role} />
  ) : (
    <ListContainer boardId={params.boardId} data={res.data} role={res.role} />
  )
}

BoardContent.Skeleton = function SkeletonBoardContent() {
  return (
    <ol className="flex gap-x-3 h-full">
      {[...Array(6)].map((_, index) => (
        <li key={index} className="shrink-0 h-full w-[272px] select-none">
          <div className="w-full rounded-md bg-gray-100 shadow-md py-2">
            <div className="h-8 bg-gray-200 rounded mt-2 mx-2" />
            <div className="h-8 bg-gray-200 rounded mt-2 mx-2" />
            <div className="h-8 bg-gray-200 rounded mt-2 mx-2" />
            <div className="h-8 bg-gray-200 rounded mt-2 mx-2" />
            <div className="h-8 bg-gray-200 rounded mt-2 mx-2" />
            <div className="h-8 bg-gray-200 rounded mt-2 mx-2" />
          </div>
        </li>
      ))}
    </ol>
  )
}

export default BoardIdPage