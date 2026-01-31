# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Food Planner is an Angular 21 PWA for weekly meal planning. Users select recipes, then generate an aggregated grocery list. Recipes are loaded from a static `recipes.json` file and selections persist to localStorage.

## Commands

```bash
npm start           # Dev server at localhost:4200
npm run build       # Production build
npm run test        # Run tests (Vitest)
npm run lint        # Lint TypeScript and HTML
npm run lint:fix    # Lint and auto-fix
npm run format      # Format code with Prettier
npm run format:check # Check formatting
```

Node version: 24 (see .nvmrc)

## Architecture

**State Management**: Uses Angular signals for reactive state. `RecipeService` holds all recipe state via signals (`selectedRecipes`, `dismissedIds`, `allRecipes`) with computed signals for derived state. State changes automatically persist to localStorage via effects.

**Components** (all standalone, no NgModules):
- `RecipeSelectionComponent` - Main view orchestrating recipe cards, modals, and grocery view
- `RecipeCardComponent` - Individual recipe display with dismiss action
- `RecipeModalComponent` / `AddRecipeModalComponent` - Modals for viewing details and adding recipes
- `GroceryListComponent` - Displays aggregated grocery items by category

**Services**:
- `RecipeService` - Recipe state, selection logic, localStorage persistence
- `PdfService` - PDF generation using jsPDF for recipes and grocery lists

**Data Flow**: Recipes load from `public/recipes.json` → `RecipeService` manages selection state → Components read via signals → `grocery-generator.ts` aggregates ingredients when generating grocery list

## Code Style

- PrimeNG components with Aura theme
- Tailwind CSS v4 for styling
- ESLint with Angular and accessibility rules
- Prettier: single quotes, trailing commas, 2-space indent, 100 char width
