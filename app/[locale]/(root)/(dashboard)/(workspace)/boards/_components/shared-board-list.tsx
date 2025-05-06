import { Link } from "@/i18n/routing"
import { getTranslations } from "next-intl/server"
import { BoardRole } from "@/lib/database/models/types"
import { getSharedBoards } from "@/lib/actions/board/get-shared-boards"

import { Skeleton } from "@/components/ui/skeleton"
import { GiIsland } from "react-icons/gi"

export const SharedBoardList = async () => {
  const tUi = await getTranslations("BoardsPage.ui")
  const boards = await getSharedBoards()
  // console.log({boards})

  if (!boards || boards.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mb-10">
      <div className="flex items-center font-semibold text-lg text-gray-700">
        <GiIsland className="h-6 w-6 mr-2" />
        {tUi("sharedTrips")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {boards && boards.map((board) => {
          const roleColor = board.role === BoardRole.EDITOR ? "bg-green-700" : "bg-blue-700"
          const roleLabel = board.role === BoardRole.EDITOR ? "Editor" : "Viewer"
          
          return (
            <Link
              key={board._id}
              href={`/board/${board._id}`}
              className={`group relative aspect-video bg-no-repeat bg-center bg-cover ${roleColor} rounded-sm h-full w-full p-2 overflow-hidden`}
              style={{ backgroundImage: board.imageUrl ? `url(${board.imageUrl})` : "none" }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="relative font-semibold text-white">
                {board.title}
              </p>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {roleLabel}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

SharedBoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="mb-10 grid gird-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  )
}