interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Загрузка...' }: LoadingStateProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-sm text-white/50">{label}</p>
    </div>
  )
}
