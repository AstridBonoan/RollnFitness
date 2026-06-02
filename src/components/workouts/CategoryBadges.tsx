import type { WorkoutCategory } from '../../data/workouts'

export function CategoryBadges({ categories }: { categories: WorkoutCategory[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <span
          key={category}
          className="rounded-md border border-octane-600/30 bg-octane-950/40 px-2 py-1 text-xs font-medium text-octane-200"
        >
          {category}
        </span>
      ))}
    </div>
  )
}
