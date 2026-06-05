import {
  RECIPE_SECTIONS,
  recipes,
  type DietCategory,
  type Recipe,
  type RecipeSection,
} from '../data/recipes'

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id)
}

export function parseRecipeRoute(pathname: string): string | null {
  const match = pathname.match(/^\/nutrition\/([^/]+)$/)
  return match?.[1] ?? null
}

export function getRecipesByDiet(diet: DietCategory): Recipe[] {
  return recipes.filter((r) => r.diet === diet).sort((a, b) => a.number - b.number)
}

export function getSectionForDiet(diet: DietCategory): RecipeSection | undefined {
  return RECIPE_SECTIONS.find((s) => s.id === diet)
}

export { recipes, RECIPE_SECTIONS }
export type { DietCategory, Recipe, RecipeSection }
