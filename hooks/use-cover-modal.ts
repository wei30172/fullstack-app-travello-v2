import { create } from "zustand"

type CoverModalStore = {
  url?: string
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onReplace: (url: string) => void
}

export const useCoverModal = create<CoverModalStore>((set) => ({
  url: undefined,
  isOpen: false,
  onOpen: () => set({ isOpen: true, url: undefined }),
  onClose: () => set({ isOpen: false, url: undefined }),
  onReplace: (url: string) => set({ isOpen: true, url })
}))

