import { useMemo, useState } from 'react'
import { nutritionTips } from '../../data/site'
import type { DietCategory } from '../../data/recipes'
import {
  getRecipesByDiet,
  RECIPE_SECTIONS,
  type Recipe,
} from '../../lib/recipes'
import { PageShell } from '../ui/PageShell'

interface NutritionPageProps {
  onNavigate: (path: string) => void
}

function scrollToDietSection(diet: DietCategory) {
  const el = document.getElementById(`meals-${diet}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export function NutritionPage({ onNavigate }: NutritionPageProps) {
  const [activeDiet, setActiveDiet] = useState<DietCategory | 'all'>('all')

  const visibleSections = useMemo(() => {
    if (activeDiet === 'all') return RECIPE_SECTIONS
    return RECIPE_SECTIONS.filter((s) => s.id === activeDiet)
  }, [activeDiet])

  return (
    <PageShell
      title="Nutrition & Meals Library"
      description="100 athlete recipes organized by dietary approach — balanced, vegetarian, vegan, pescetarian, and keto. Each includes macros, ingredients, and step-by-step instructions."
    >
      <nav
        className="mb-10 flex flex-wrap gap-2"
        aria-label="Jump to dietary section"
      >
        <DietJumpButton
          active={activeDiet === 'all'}
          onClick={() => setActiveDiet('all')}
        >
          All meals (100)
        </DietJumpButton>
        {RECIPE_SECTIONS.map((section) => (
          <DietJumpButton
            key={section.id}
            active={activeDiet === section.id}
            onClick={() => {
              setActiveDiet(section.id)
              requestAnimationFrame(() => scrollToDietSection(section.id))
            }}
          >
            {section.label.replace(' Athlete Recipes', '')} ({section.count})
          </DietJumpButton>
        ))}
      </nav>

      <div className="space-y-14">
        {visibleSections.map((section) => {
          const meals = getRecipesByDiet(section.id)

          return (
            <section
              key={section.id}
              id={`meals-${section.id}`}
              aria-labelledby={`meals-heading-${section.id}`}
              className="scroll-mt-28 focus:outline-none focus-visible:ring-2 focus-visible:ring-octane-400"
            >
              <div className="border-b border-white/10 pb-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-vitality-400">
                  Recipes {section.range}
                </p>
                <h2
                  id={`meals-heading-${section.id}`}
                  className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl"
                >
                  {section.label}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
                  {section.description}
                </p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {meals.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onOpen={() => onNavigate(`/nutrition/${recipe.id}`)}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <section className="mt-16" aria-labelledby="tips-heading">
        <h2 id="tips-heading" className="font-display text-xl font-bold text-white">
          Foundational guidance
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {nutritionTips.map((tip) => (
            <article key={tip.title} className="card-hover card-surface p-6">
              <h3 className="text-lg font-bold text-white">{tip.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-300">{tip.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mt-12 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 shadow-glow"
        aria-labelledby="hydration-heading"
      >
        <h2 id="hydration-heading" className="text-2xl font-bold text-white">
          Daily hydration reminder
        </h2>
        <p className="mt-3 max-w-xl text-brand-100">
          Adaptive athletes often underestimate fluid needs during seated training. Keep water within
          reach and aim for consistent intake throughout the day — not just during workouts.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full w-3/5 rounded-full bg-brand-300"
              role="progressbar"
              aria-valuenow={60}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Daily hydration goal 60% complete"
            />
          </div>
          <span className="text-sm font-semibold text-white">6 / 10 cups</span>
        </div>
      </section>
    </PageShell>
  )
}

function RecipeCard({ recipe, onOpen }: { recipe: Recipe; onOpen: () => void }) {
  return (
    <article className="card-hover card-surface flex flex-col p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        #{recipe.number} · Serves {recipe.servings}
      </p>
      <h3 className="mt-2 text-lg font-bold text-white">{recipe.title}</h3>
      <dl className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
        <div>
          <dt className="text-slate-500">Cal</dt>
          <dd className="font-semibold text-white">{recipe.nutrition.calories}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Protein</dt>
          <dd className="font-semibold text-vitality-400">{recipe.nutrition.protein}g</dd>
        </div>
        <div>
          <dt className="text-slate-500">Carbs</dt>
          <dd className="font-semibold text-octane-400">{recipe.nutrition.carbs}g</dd>
        </div>
        <div>
          <dt className="text-slate-500">Fat</dt>
          <dd className="font-semibold text-circuit-400">{recipe.nutrition.fat}g</dd>
        </div>
      </dl>
      <button
        type="button"
        className="btn-start-now touch-target mt-5 w-full py-2.5 text-sm"
        onClick={onOpen}
      >
        View recipe
      </button>
    </article>
  )
}

function DietJumpButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`touch-target rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-vitality-600 text-white'
          : 'border border-white/15 bg-white/5 text-slate-200 hover:border-vitality-500/40 hover:bg-vitality-950/40'
      }`}
    >
      {children}
    </button>
  )
}
