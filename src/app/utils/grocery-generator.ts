import { Recipe, GroceryItem, GroceryList } from '../models/recipe.model';

export function generateGroceryList(recipes: Recipe[]): GroceryList {
  const itemMap = new Map<string, GroceryItem>();

  // Aggregate all ingredients
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.name.toLowerCase().trim()}-${ingredient.unit.toLowerCase().trim()}`;

      if (itemMap.has(key)) {
        const existing = itemMap.get(key)!;
        existing.quantity += ingredient.quantity;
      } else {
        itemMap.set(key, {
          id: key,
          name: ingredient.name.toLowerCase().trim(),
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          category: ingredient.category,
        });
      }
    }
  }

  // Group by category
  const groceryList: GroceryList = {
    produce: [],
    meat: [],
    dairy: [],
    pantry: [],
    frozen: [],
  };

  for (const item of itemMap.values()) {
    groceryList[item.category].push(item);
  }

  // Sort each category alphabetically
  for (const category of Object.keys(groceryList) as Array<keyof GroceryList>) {
    groceryList[category].sort((a, b) => a.name.localeCompare(b.name));
  }

  return groceryList;
}

export function formatQuantity(quantity: number, unit: string): string {
  // Round to 2 decimal places if needed
  const rounded = Math.round(quantity * 100) / 100;
  const displayQuantity = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  return `${displayQuantity} ${unit}`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
