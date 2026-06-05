import { getRecipeById } from '../../lib/recipes'
import type { Recipe } from '../../data/recipes'
import { PageShell } from '../ui/PageShell'

interface RecipeDetailPageProps {
  recipeId: string
  onNavigate: (path: string) => void
}

function MacroGrid({ nutrition }: { nutrition: Recipe['nutrition'] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-xl bg-white/5 p-3 text-center">
        <dt className="text-xs text-slate-400">Calories</dt>
        <dd className="mt-1 font-display text-lg font-bold text-white">{nutrition.calories}</dd>
      </div>
      <div className="rounded-xl bg-white/5 p-3 text-center">
        <dt className="text-xs text-slate-400">Protein</dt>
        <dd className="mt-1 font-display text-lg font-bold text-vitality-400">{nutrition.protein}g</dd>
      </div>
      <div className="rounded-xl bg-white/5 p-3 text-center">
        <dt className="text-xs text-slate-400">Carbs</dt>
        <dd className="mt-1 font-display text-lg font-bold text-octane-400">{nutrition.carbs}g</dd>
      </div>
      <div className="rounded-xl bg-white/5 p-3 text-center">
        <dt className="text-xs text-slate-400">Fat</dt>
        <dd className="mt-1 font-display text-lg font-bold text-circuit-400">{nutrition.fat}g</dd>
      </div>
    </dl>
  )
}

export function RecipeDetailPage({ recipeId, onNavigate }: RecipeDetailPageProps) {
  const recipe = getRecipeById(recipeId)

  if (!recipe) {
    return (
      <PageShell title="Recipe not found" description="This meal is not in the library.">
        <button
          type="button"
          onClick={() => onNavigate('/nutrition')}
          className="touch-target text-sm font-medium text-octane-400 hover:text-octane-300"
        >
          ← Back to meals library
        </button>
      </PageShell>
    )
  }

  return (
    <PageShell
      title={recipe.title}
      description={`Recipe #${recipe.number} · Serves ${recipe.servings}`}
    >
      <button
        type="button"
        onClick={() => onNavigate('/nutrition')}
        className="touch-target mb-6 text-sm font-medium text-octane-400 hover:text-octane-300"
      >
        ← Back to meals library
      </button>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <section className="card-surface p-6" aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading" className="text-lg font-bold text-white">
              Ingredients
            </h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-300">
              {recipe.ingredients.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="card-surface p-6" aria-labelledby="instructions-heading">
            <h2 id="instructions-heading" className="text-lg font-bold text-white">
              Instructions
            </h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-300">
              {recipe.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-2">
          <div className="card-surface p-6">
            <h2 className="text-lg font-bold text-white">Nutrition per serving</h2>
            <div className="mt-4">
              <MacroGrid nutrition={recipe.nutrition} />
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
