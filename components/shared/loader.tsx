import { FiLoader } from "react-icons/fi"

interface LoaderProps {
  className?: string
}

export const Loader = ({ className }: LoaderProps) => {
  return (
    <div className="laoding-animation">
      <FiLoader className={`w-6 h-6 ${className}`}/>
    </div>
  )
}