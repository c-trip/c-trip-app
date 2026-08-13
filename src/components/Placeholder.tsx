type PlaceholderProps = {
  title: string
  note?: string
}

export default function Placeholder({ title, note }: PlaceholderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50">
      <div className="text-center">
        <div className="text-sm font-semibold uppercase tracking-widest text-amber-600">UI pendente</div>
        <h1 className="mt-2 text-2xl font-semibold text-ink-800">{title}</h1>
        {note && <p className="mt-1 text-sm text-ink-500">{note}</p>}
      </div>
    </div>
  )
}
