import { balancedRecipes } from './balanced'
import { vegetarianRecipes } from './vegetarian'
import { veganRecipes } from './vegan'
import { pescetarianRecipes } from './pescetarian'
import { ketoRecipes } from './keto'

export const recipes = [
  ...balancedRecipes,
  ...vegetarianRecipes,
  ...veganRecipes,
  ...pescetarianRecipes,
  ...ketoRecipes,
]

export * from './types'
