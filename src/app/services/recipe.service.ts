import {
  computed,
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { Recipe, RecipesFile } from '../models/recipe.model';

const STORAGE_KEYS = {
  SELECTED_IDS: 'food-planner-selected-ids',
  DISMISSED_IDS: 'food-planner-dismissed-ids',
};

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private readonly INITIAL_COUNT = 4;

  // Signals for reactive state
  private allRecipesSignal = signal<Recipe[]>([]);
  private selectedRecipesSignal = signal<Recipe[]>([]);
  private dismissedIdsSignal = signal<Set<string>>(new Set());
  private loadingSignal = signal<boolean>(true);
  private errorSignal = signal<string | null>(null);
  private persistenceReady = false;
  private readonly environmentInjector = inject(EnvironmentInjector);

  // Public readonly signals
  readonly allRecipes = this.allRecipesSignal.asReadonly();
  readonly selectedRecipes = this.selectedRecipesSignal.asReadonly();
  readonly dismissedIds = this.dismissedIdsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed signals
  readonly selectedCount = computed(() => this.selectedRecipesSignal().length);

  // Available recipes for auto-suggestion (excludes selected AND dismissed)
  readonly availableForSuggestion = computed(() => {
    const selected = new Set(this.selectedRecipesSignal().map(r => r.id));
    const dismissed = this.dismissedIdsSignal();
    return this.allRecipesSignal().filter(r => !selected.has(r.id) && !dismissed.has(r.id));
  });

  // Available recipes for search (excludes selected only, dismissed can be re-added)
  readonly availableForSearch = computed(() => {
    const selected = new Set(this.selectedRecipesSignal().map(r => r.id));
    return this.allRecipesSignal().filter(r => !selected.has(r.id));
  });

  constructor() {
    this.loadRecipes();
  }

  async loadRecipes(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const recipesUrl = new URL('recipes.json', document.baseURI).toString();
      const response = await fetch(recipesUrl);
      if (!response.ok) {
        throw new Error('Failed to load recipes');
      }
      const data: RecipesFile = await response.json();
      this.allRecipesSignal.set(data.recipes);
      this.restoreOrInitializeState(data.recipes);
      this.setupPersistence();
    } catch (err) {
      this.errorSignal.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private restoreOrInitializeState(allRecipes: Recipe[]): void {
    // Try to restore from localStorage
    const savedSelectedIds = this.loadFromStorage<string[]>(STORAGE_KEYS.SELECTED_IDS);
    const savedDismissedIds = this.loadFromStorage<string[]>(STORAGE_KEYS.DISMISSED_IDS);

    if (savedDismissedIds && savedDismissedIds.length > 0) {
      this.dismissedIdsSignal.set(new Set(savedDismissedIds));
    }

    if (savedSelectedIds && savedSelectedIds.length > 0) {
      // Restore selected recipes from IDs
      const recipeMap = new Map(allRecipes.map(r => [r.id, r]));
      const restoredRecipes = savedSelectedIds
        .map(id => recipeMap.get(id))
        .filter((r): r is Recipe => r !== undefined);

      if (restoredRecipes.length > 0) {
        this.selectedRecipesSignal.set(restoredRecipes);
        return;
      }
    }

    // No saved state, initialize with random selection
    this.initializeSelection();
  }

  private loadFromStorage<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private setupPersistence(): void {
    if (this.persistenceReady) return;
    this.persistenceReady = true;

    runInInjectionContext(this.environmentInjector, () => {
      effect(() => {
        const selectedIds = this.selectedRecipesSignal().map(r => r.id);
        localStorage.setItem(STORAGE_KEYS.SELECTED_IDS, JSON.stringify(selectedIds));
      });

      effect(() => {
        const dismissedIds = Array.from(this.dismissedIdsSignal());
        localStorage.setItem(STORAGE_KEYS.DISMISSED_IDS, JSON.stringify(dismissedIds));
      });
    });
  }

  private initializeSelection(): void {
    const shuffled = this.shuffleArray([...this.allRecipesSignal()]);
    this.selectedRecipesSignal.set(shuffled.slice(0, this.INITIAL_COUNT));
  }

  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  private getRandomFromAvailable(): Recipe | null {
    const available = this.availableForSuggestion();
    if (available.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
  }

  dismissRecipe(recipeId: string): void {
    const currentCount = this.selectedCount();
    const currentSelected = this.selectedRecipesSignal();

    // Add to dismissed list
    const newDismissed = new Set(this.dismissedIdsSignal());
    newDismissed.add(recipeId);
    this.dismissedIdsSignal.set(newDismissed);

    if (currentCount <= this.INITIAL_COUNT) {
      // Replace with a new random recipe
      const replacement = this.getRandomFromAvailable();
      if (replacement) {
        this.selectedRecipesSignal.set(
          currentSelected.map(r => (r.id === recipeId ? replacement : r))
        );
      } else {
        // No replacement available, just remove
        this.selectedRecipesSignal.set(currentSelected.filter(r => r.id !== recipeId));
      }
    } else {
      // Just remove without replacement
      this.selectedRecipesSignal.set(currentSelected.filter(r => r.id !== recipeId));
    }
  }

  addRecipe(recipe: Recipe): void {
    // Remove from dismissed list if present
    const newDismissed = new Set(this.dismissedIdsSignal());
    newDismissed.delete(recipe.id);
    this.dismissedIdsSignal.set(newDismissed);

    // Add to selection
    this.selectedRecipesSignal.update(current => [...current, recipe]);
  }

  searchRecipes(query: string): Recipe[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return this.availableForSearch();
    }
    return this.availableForSearch().filter(recipe =>
      recipe.name.toLowerCase().includes(normalizedQuery)
    );
  }

  resetAll(): void {
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.SELECTED_IDS);
    localStorage.removeItem(STORAGE_KEYS.DISMISSED_IDS);

    // Reset state
    this.dismissedIdsSignal.set(new Set());
    this.initializeSelection();
  }
}
