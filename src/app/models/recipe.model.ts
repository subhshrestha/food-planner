export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: 'produce' | 'meat' | 'dairy' | 'pantry' | 'frozen';
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  categories?: string[];
}

export interface RecipesFile {
  recipes: Recipe[];
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'produce' | 'meat' | 'dairy' | 'pantry' | 'frozen';
}

export interface GroceryList {
  produce: GroceryItem[];
  meat: GroceryItem[];
  dairy: GroceryItem[];
  pantry: GroceryItem[];
  frozen: GroceryItem[];
}
