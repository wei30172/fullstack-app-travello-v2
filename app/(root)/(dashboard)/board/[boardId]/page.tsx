import { getLists } from "@/lib/actions/list/get-lists"

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
        <ListContainer
          boardId={params.boardId}
          data={res.data}
        />
      )}
    </section>
  )
}

export default BoardIdPage