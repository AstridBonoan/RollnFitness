export type DietCategory = 'balanced' | 'vegetarian' | 'vegan' | 'pescetarian' | 'keto'

export interface RecipeNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Recipe {
  id: string
  number: number
  title: string
  diet: DietCategory
  servings: number
  ingredients: string[]
  instructions: string[]
  nutrition: RecipeNutrition
}

export interface RecipeSection {
  id: DietCategory
  label: string
  range: string
  count: number
  description: string
}

export const RECIPE_SECTIONS: RecipeSection[] = [
  {
    id: 'balanced',
    label: 'Balanced Athlete Recipes',
    range: '1–25',
    count: 25,
    description:
      'Well-rounded meals with lean protein, complex carbs, and healthy fats for everyday training fuel.',
  },
  {
    id: 'vegetarian',
    label: 'Vegetarian Athlete Recipes',
    range: '26–45',
    count: 20,
    description:
      'Plant-forward meals with dairy and eggs for strong protein without meat.',
  },
  {
    id: 'vegan',
    label: 'Vegan Athlete Recipes',
    range: '46–65',
    count: 20,
    description:
      'Plant-based protein, complex carbohydrates, healthy fats, and recovery-supporting nutrients.',
  },
  {
    id: 'pescetarian',
    label: 'Pescetarian Athlete Recipes',
    range: '66–80',
    count: 15,
    description:
      'High-quality protein and omega-3s from fish and seafood for recovery, heart health, and endurance.',
  },
  {
    id: 'keto',
    label: 'Keto Athlete Recipes',
    range: '81–100',
    count: 20,
    description:
      'Lower-carbohydrate, higher-fat meals for athletes who follow ketogenic or reduced-carb eating plans.',
  },
]
