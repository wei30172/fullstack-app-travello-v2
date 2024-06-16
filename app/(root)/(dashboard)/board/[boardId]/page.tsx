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
  const res = await getLists(params.boardId)

  return (
    <section className="p-4 h-full overflow-x-auto">
      {"error" in res ? (
        <div>Error loading lists: {res.error}</div>
      ) : (
        res.role === BoardRole.VIEWER ? (
          <ReadOnlyListContainer
            data={res.data}
            role={res.role}
          />
        ) : (
          <ListContainer
            boardId={params.boardId}
            data={res.data}
            role={res.role}
          />
        )
      )}
    </section>
  )
}

export default BoardIdPage