# Weekly Food Planner - Execution Plan

## Phase 1: Project Setup

### Step 1.1: Initialize Angular Project
- [ ] Create new Angular 21 project with standalone components
- [ ] Configure TypeScript strict mode
- [ ] Set up project structure (components, services, models, utils folders)

### Step 1.2: Install Dependencies
- [ ] Install PrimeNG 21 and PrimeIcons
- [ ] Install normalize.css
- [ ] Install Tailwind CSS and configure
- [ ] Install jsPDF for PDF generation

### Step 1.3: Configure Linting & Formatting
- [ ] Install and configure ESLint with Angular ESLint
- [ ] Install and configure Prettier
- [ ] Create `.eslintrc.json` configuration
- [ ] Create `.prettierrc` configuration
- [ ] Create `.prettierignore` file
- [ ] Add lint and format scripts to package.json

### Step 1.4: Set Up CI/CD
- [ ] Create `.github/workflows/ci.yml`
- [ ] Configure lint, format check, and build steps
- [ ] Configure artifact upload

### Step 1.5: Configure Styling
- [ ] Import normalize.css in styles.css
- [ ] Configure PrimeNG theme
- [ ] Set up Tailwind CSS with Angular
- [ ] Create base styles and CSS variables

---

## Phase 2: Core Data Layer

### Step 2.1: Define Models
- [ ] Create `Recipe` interface
- [ ] Create `Ingredient` interface
- [ ] Create `GroceryItem` interface
- [ ] Create `AppState` interface

### Step 2.2: Create Sample Data
- [ ] Create `recipes.json` with 10-15 sample recipes
- [ ] Place in `public/` folder
- [ ] Validate JSON structure

### Step 2.3: Create Recipe Service
- [ ] Create `recipe.service.ts`
- [ ] Implement `loadRecipes()` - fetch from JSON
- [ ] Implement state using Angular Signals:
  - `allRecipes` - all loaded recipes
  - `selectedRecipes` - current selection (starts with 4)
  - `dismissedIds` - Set of dismissed recipe IDs
- [ ] Implement `getInitialSelection()` - random 4 recipes
- [ ] Implement `dismissRecipe(id)` - handle delete logic:
  - If count ≤ 4: replace with new random recipe
  - If count > 4: just remove
- [ ] Implement `addRecipe(recipe)` - add to selection
- [ ] Implement `getAvailableForSuggestion()` - excludes selected & dismissed (for auto-replace)
- [ ] Implement `getAvailableForSearch()` - excludes selected only (dismissed can be re-added)
- [ ] Implement `searchRecipes(query)` - filter by name from available for search
- [ ] Implement `addRecipe(recipe)` - add to selection, remove from dismissed if present
- [ ] Implement `resetAll()` - clear selection, dismissed list, get new random 4

---

## Phase 3: UI Components

### Step 3.1: App Component (Shell)
- [ ] Set up main layout structure
- [ ] Add header with app title
- [ ] Configure view switching (selection vs grocery list)

### Step 3.2: Recipe Card Component
- [ ] Create `recipe-card` component
- [ ] Display recipe name and placeholder image
- [ ] Add delete (X) button in corner
- [ ] Emit events: `onDelete`, `onClick` (view details)
- [ ] Style with PrimeNG Card + Tailwind

### Step 3.3: Recipe Selection Component (Main View)
- [ ] Create `recipe-selection` component
- [ ] Display header with app title and "Start Fresh" button
- [ ] Display subheader with count: "Your selections (N)" and "+ Add" button
- [ ] Display grid of RecipeCard components
- [ ] Add "Download Recipes PDF" button
- [ ] Add "Generate Grocery List" button
- [ ] Handle card delete events
- [ ] Handle card click events (open detail modal)
- [ ] Handle "Start Fresh" click with confirmation dialog (PrimeNG ConfirmDialog)

### Step 3.4: Recipe Modal Component
- [ ] Create `recipe-modal` component
- [ ] Use PrimeNG Dialog
- [ ] Display: name, prep time, cook time, servings
- [ ] Display ingredients list
- [ ] Display cooking instructions
- [ ] Add close button

### Step 3.5: Add Recipe Modal Component
- [ ] Create `add-recipe-modal` component
- [ ] Use PrimeNG Dialog
- [ ] Add search input (PrimeNG InputText)
- [ ] Display filtered recipe list
- [ ] Add "Add" button for each recipe
- [ ] Emit event when recipe added
- [ ] Close modal on add or cancel

### Step 3.6: Grocery List Component
- [ ] Create `grocery-list` component
- [ ] Display header with "Download PDF" button
- [ ] Group items by category (produce, meat, dairy, pantry, frozen)
- [ ] Display each item with quantity and unit
- [ ] Add "Back to Recipes" button
- [ ] Style with PrimeNG components + Tailwind

---

## Phase 4: Grocery Generation

### Step 4.1: Create Grocery Generator Utility
- [ ] Create `grocery-generator.ts`
- [ ] Implement `generateGroceryList(recipes)`:
  - Extract all ingredients from selected recipes
  - Normalize ingredient names (lowercase, trim)
  - Group by name and sum quantities (same unit)
  - Categorize by grocery section
  - Sort alphabetically within categories
- [ ] Return structured `GroceryItem[]` grouped by category

---

## Phase 5: PDF Export

### Step 5.1: Create PDF Service
- [ ] Create `pdf.service.ts`
- [ ] Implement `generateRecipesPdf(recipes)`:
  - Create PDF document with jsPDF
  - Add title "Weekly Meal Plan - [Date]"
  - For each recipe: name, times, ingredients, instructions
  - Handle page breaks
  - Trigger download
- [ ] Implement `generateGroceryPdf(groceryItems)`:
  - Create PDF document
  - Add title "Grocery List - [Date]"
  - Group by category with headers
  - Add checkbox squares for each item
  - Trigger download

---

## Phase 6: Integration & Polish

### Step 6.1: Wire Up Components
- [ ] Connect RecipeSelection to RecipeService
- [ ] Connect AddRecipeModal to search functionality
- [ ] Connect GroceryList to grocery generator
- [ ] Connect PDF buttons to PDF service
- [ ] Implement view navigation (selection ↔ grocery list)

### Step 6.2: Add Animations
- [ ] Add fade animation for card replacement
- [ ] Add modal open/close animations (PrimeNG built-in)

### Step 6.3: Responsive Design
- [ ] Test and adjust grid for mobile (1-2 columns)
- [ ] Test and adjust grid for tablet (2-3 columns)
- [ ] Test and adjust grid for desktop (3-4 columns)
- [ ] Ensure modals work on mobile

### Step 6.4: Error Handling
- [ ] Handle recipes.json load failure
- [ ] Handle empty recipe collection
- [ ] Handle no more recipes available for replacement

---

## Phase 7: Testing & Quality

### Step 7.1: Run Linting
- [ ] Run `npm run lint`
- [ ] Fix any linting errors
- [ ] Run `npm run format`

### Step 7.2: Manual Testing
- [ ] Test initial load with 4 recipes
- [ ] Test delete/replace when count ≤ 4
- [ ] Test delete without replace when count > 4
- [ ] Test add recipe via search
- [ ] Test adding previously dismissed recipe via search
- [ ] Test recipe detail modal
- [ ] Test grocery list generation
- [ ] Test recipes PDF download
- [ ] Test grocery list PDF download
- [ ] Test "Start Fresh" button (confirmation + reset)
- [ ] Test on mobile viewport

### Step 7.3: Build Verification
- [ ] Run `npm run build`
- [ ] Verify no build errors
- [ ] Check bundle size
- [ ] Test production build locally

---

## Phase 8: Deployment

### Step 8.1: Prepare for Deployment
- [ ] Ensure `recipes.json` is in build output
- [ ] Verify all assets are included
- [ ] Create/update nginx configuration

### Step 8.2: Deploy
- [ ] Push to GitHub (triggers CI/CD)
- [ ] Verify CI pipeline passes
- [ ] Download build artifacts
- [ ] Deploy to nginx server

---

## File Checklist

### Configuration Files
- [ ] `angular.json`
- [ ] `package.json`
- [ ] `tsconfig.json`
- [ ] `tailwind.config.js`
- [ ] `.eslintrc.json`
- [ ] `.prettierrc`
- [ ] `.prettierignore`
- [ ] `.github/workflows/ci.yml`

### Source Files
- [ ] `src/main.ts`
- [ ] `src/styles.css`
- [ ] `src/index.html`
- [ ] `src/app/app.component.ts`
- [ ] `src/app/app.component.html`
- [ ] `src/app/app.component.css`
- [ ] `src/app/app.config.ts`
- [ ] `src/app/models/recipe.model.ts`
- [ ] `src/app/services/recipe.service.ts`
- [ ] `src/app/services/pdf.service.ts`
- [ ] `src/app/utils/grocery-generator.ts`
- [ ] `src/app/components/recipe-card/recipe-card.component.ts`
- [ ] `src/app/components/recipe-card/recipe-card.component.html`
- [ ] `src/app/components/recipe-card/recipe-card.component.css`
- [ ] `src/app/components/recipe-selection/recipe-selection.component.ts`
- [ ] `src/app/components/recipe-selection/recipe-selection.component.html`
- [ ] `src/app/components/recipe-selection/recipe-selection.component.css`
- [ ] `src/app/components/recipe-modal/recipe-modal.component.ts`
- [ ] `src/app/components/recipe-modal/recipe-modal.component.html`
- [ ] `src/app/components/recipe-modal/recipe-modal.component.css`
- [ ] `src/app/components/add-recipe-modal/add-recipe-modal.component.ts`
- [ ] `src/app/components/add-recipe-modal/add-recipe-modal.component.html`
- [ ] `src/app/components/add-recipe-modal/add-recipe-modal.component.css`
- [ ] `src/app/components/grocery-list/grocery-list.component.ts`
- [ ] `src/app/components/grocery-list/grocery-list.component.html`
- [ ] `src/app/components/grocery-list/grocery-list.component.css`

### Data Files
- [ ] `public/recipes.json`

---

## Estimated Effort by Phase

| Phase | Description | Complexity |
|-------|-------------|------------|
| 1 | Project Setup | Low |
| 2 | Core Data Layer | Medium |
| 3 | UI Components | High |
| 4 | Grocery Generation | Low |
| 5 | PDF Export | Medium |
| 6 | Integration & Polish | Medium |
| 7 | Testing & Quality | Low |
| 8 | Deployment | Low |
