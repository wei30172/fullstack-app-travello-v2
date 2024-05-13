const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-full flex fex-col items-center justify-center">
      {children}
    </div>
  )
}

export default AuthLayout