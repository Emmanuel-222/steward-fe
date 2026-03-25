type MeetingsTabsProps = {
  tabs: string[]
}

function MeetingsTabs({ tabs }: MeetingsTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          type="button"
          className={[
            'rounded-full px-4 py-2 text-sm font-semibold transition',
            index === 0
              ? 'bg-[#0f2d52] text-white'
              : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700',
          ].join(' ')}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

export default MeetingsTabs
