# Weekly Food Planner - App Specification

## Overview

A simple, self-hosted web application for weekly meal planning. The app suggests 3-4 recipes which the user can curate by dismissing unwanted options until satisfied. Once happy with the selection, the app generates a consolidated grocery list for weekend shopping and meal prep.

**Core Flow:**
1. App shows 3-4 random recipe suggestions
2. User dismisses recipes they don't want (replaced with new ones)
3. Dismissed recipes won't appear again in the session
4. Once satisfied, user generates a grocery list
5. User shops with the checklist

---

## 1. Requirements

### 1.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | System loads recipes from a pre-defined JSON file (manually maintained) | High |
| FR-02 | On load, system automatically displays 3-4 random recipe suggestions | High |
| FR-03 | Each recipe card shows a delete icon to remove it | High |
| FR-04 | Delete behavior: if count ≤ 4, replace with new recipe; if count > 4, just remove | High |
| FR-05 | Dismissed recipes are excluded from auto-suggestions but can be re-added via search | High |
| FR-06 | User continues dismissing until satisfied with the displayed list | High |
| FR-07 | User can add more recipes via search (flexible count: 3, 5, 10, etc.) | High |
| FR-08 | User can search recipes by name | High |
| FR-09 | User can download selected recipes as PDF (for printing/sharing) | High |
| FR-10 | System auto-generates grocery list based on final selected recipes | High |
| FR-11 | User can view grocery list in-app (read-only) | High |
| FR-12 | User can download grocery list as PDF (for printing/sharing) | High |
| FR-13 | User can reset all state and start fresh with new suggestions | High |

### 1.2 Recipe Management

Recipes are **manually maintained** by editing the `recipes.json` file directly. There is no in-app recipe editor.

**To add/edit recipes:**
1. Open `recipes.json` in a text editor
2. Add or modify recipe entries following the schema
3. Save the file
4. Refresh the app to load updated recipes

### 1.3 Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-01 | Static file deployment on Nginx | High |
| NFR-02 | Works offline after initial load (PWA) | Medium |
| NFR-03 | Mobile-responsive design | High |
| NFR-04 | Recipes loaded from static JSON file | High |
| NFR-05 | Meal plans & grocery lists stored in browser (IndexedDB/localStorage) | High |
| NFR-06 | No authentication required (personal use) | High |
| NFR-07 | Fast page load (<2s) | Medium |

---

## 2. Use Cases

### UC-01: Curate Weekly Meal Selection

**Actor:** User
**Precondition:** App is loaded with recipes.json
**Flow:**
1. User opens the app
2. System automatically displays 4 randomly selected recipes as cards
3. User reviews the suggested recipes
4. If user doesn't like a recipe, they click the delete (X) icon
5. **Delete behavior:**
   - If current count ≤ 4: recipe is replaced with a new random one
   - If current count > 4: recipe is simply removed (no replacement)
6. The deleted recipe is added to a "dismissed" list (won't appear again this session)
7. User can add more recipes using "+ Add" button (see UC-02)
8. User clicks "Generate Grocery List" when done

**Example:**
- App shows 4 recipes → delete one → replaced (still 4)
- User adds 2 via search → now 6 recipes
- User deletes 1 → just removed, now 5 (no replacement)
- User deletes 1 → just removed, now 4
- User deletes 1 → replaced (maintains 4)

**Postcondition:** User has a curated list of recipes (minimum 4, no maximum)

---

### UC-02: Add More Recipes via Search

**Actor:** User
**Precondition:** User wants more than the initial suggestions
**Flow:**
1. User clicks "Add Recipe" button
2. System shows a search modal/panel
3. User types recipe name in search box
4. System filters and displays matching recipes:
   - **Excludes:** currently selected/visible recipes
   - **Includes:** previously dismissed recipes (user can re-add)
5. User clicks on a recipe to add it to their selection
6. Recipe card appears in the main selection grid
7. If recipe was previously dismissed, it's removed from dismissed list
8. User can repeat to add more recipes

**Postcondition:** Additional recipes added to the weekly plan

---

### UC-03: View Recipe Details

**Actor:** User
**Precondition:** Recipes are displayed on screen
**Flow:**
1. User clicks on a recipe card (not the delete icon)
2. System shows recipe details in a modal/expanded view
3. User sees: ingredients list, cooking instructions, prep time, servings
4. User closes the modal to return to selection view

**Postcondition:** User understands what the recipe involves

---

### UC-04: Generate Grocery List

**Actor:** User
**Precondition:** User has confirmed their recipe selection
**Flow:**
1. User clicks "Generate Grocery List"
2. System aggregates all ingredients from the selected recipes
3. System combines duplicate ingredients (e.g., 2 onions + 1 onion = 3 onions)
4. System displays categorized grocery list (produce, dairy, meat, pantry, etc.)
5. User can manually add or remove items

**Postcondition:** Grocery list ready for shopping

---

### UC-05: Download Recipes as PDF

**Actor:** User
**Precondition:** User has finalized recipe selection
**Flow:**
1. User clicks "Download Recipes PDF" button
2. System generates a PDF containing:
   - All selected recipe names
   - Ingredients list for each recipe
   - Cooking instructions for each recipe
3. Browser downloads the PDF file
4. User can print or share the PDF

**Postcondition:** User has printable recipe document

---

### UC-06: Download Grocery List as PDF

**Actor:** User
**Precondition:** Grocery list has been generated
**Flow:**
1. User clicks "Download PDF" button on grocery list view
2. System generates a PDF containing:
   - All grocery items grouped by category
   - Quantities and units
   - Empty checkboxes for manual checking while shopping
3. Browser downloads the PDF file

**Postcondition:** User has printable shopping list

---

### UC-07: Start Fresh

**Actor:** User
**Precondition:** User wants to start over with new suggestions
**Flow:**
1. User clicks "Start Fresh" button
2. System shows confirmation dialog
3. User confirms
4. System clears:
   - Current selection
   - Dismissed recipes list
   - Generated grocery list (if any)
5. System loads new random 4 recipe suggestions
6. User begins curation process again

**Postcondition:** Fresh session with all recipes available

---

## 3. Technical Specifications

### 3.1 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Browser                            │
├─────────────────────────────────────────────────────┤
│                 Frontend SPA                         │
│            (React / Vue / Svelte)                    │
│                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Views/    │  │   State     │  │  Services   │  │
│  │ Components  │  │ Management  │  │  (Storage)  │  │
│  └─────────────┘  └─────────────┘  └──────┬──────┘  │
│                                           │         │
│  ┌────────────────────────────────────────▼──────┐  │
│  │         IndexedDB / localStorage              │  │
│  │            (Client-side storage)              │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                        │
            Static files served by
                        │
┌─────────────────────────────────────────────────────┐
│                    Nginx                             │
│              (Static file server)                    │
│         Serves: HTML, CSS, JS, assets                │
└─────────────────────────────────────────────────────┘
```

### 3.2 Recommended Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | **Angular 21** | Full-featured, standalone components |
| Language | **TypeScript** | Built-in with Angular |
| CSS Reset | **normalize.css** | Consistent cross-browser styling |
| UI Components | **PrimeNG 21** | Rich Angular component library |
| Styling | **Tailwind CSS** | Utility-first, custom styling |
| State | **Angular Signals** | Built-in reactive state |
| PDF Generation | **jsPDF** | Client-side PDF creation |
| Linting | **ESLint + Angular ESLint** | Code quality and consistency |
| Formatting | **Prettier** | Consistent code formatting |
| Build Output | **Static HTML/CSS/JS** | No server runtime needed |
| CI/CD | **GitHub Actions** | Automated lint, build, deploy |
| Hosting | **Nginx** | Simple static file serving |

### 3.3 Data Models

#### recipes.json (Static file - manually maintained)

**Schema:**
```typescript
interface RecipesFile {
  recipes: Recipe[]
}

interface Recipe {
  id: string           // Unique identifier (kebab-case)
  name: string         // Display name
  ingredients: Ingredient[]
  instructions: string // Cooking steps (use \n for line breaks)
  prepTime: number     // Minutes
  cookTime: number     // Minutes
  servings: number     // Number of servings
  categories?: string[] // Optional tags for filtering
}

interface Ingredient {
  name: string         // Ingredient name (lowercase for aggregation)
  quantity: number     // Amount
  unit: string         // cups, tbsp, g, kg, pieces, etc.
  category: string     // produce, meat, dairy, pantry, frozen
}
```

**Example recipes.json:**
```json
{
  "recipes": [
    {
      "id": "chicken-stir-fry",
      "name": "Chicken Stir Fry",
      "ingredients": [
        { "name": "chicken breast", "quantity": 500, "unit": "g", "category": "meat" },
        { "name": "broccoli", "quantity": 2, "unit": "cups", "category": "produce" },
        { "name": "bell pepper", "quantity": 1, "unit": "pieces", "category": "produce" },
        { "name": "soy sauce", "quantity": 3, "unit": "tbsp", "category": "pantry" },
        { "name": "garlic", "quantity": 3, "unit": "cloves", "category": "produce" },
        { "name": "vegetable oil", "quantity": 2, "unit": "tbsp", "category": "pantry" }
      ],
      "instructions": "1. Cut chicken into bite-sized cubes\n2. Mince garlic and slice bell pepper\n3. Heat oil in wok over high heat\n4. Stir-fry chicken until golden (5-6 min)\n5. Add vegetables and garlic, cook 3-4 min\n6. Add soy sauce, toss to combine\n7. Serve over rice",
      "prepTime": 15,
      "cookTime": 15,
      "servings": 4,
      "categories": ["quick", "asian"]
    },
    {
      "id": "pasta-primavera",
      "name": "Pasta Primavera",
      "ingredients": [
        { "name": "penne pasta", "quantity": 400, "unit": "g", "category": "pantry" },
        { "name": "zucchini", "quantity": 1, "unit": "pieces", "category": "produce" },
        { "name": "cherry tomatoes", "quantity": 200, "unit": "g", "category": "produce" },
        { "name": "parmesan cheese", "quantity": 50, "unit": "g", "category": "dairy" },
        { "name": "olive oil", "quantity": 3, "unit": "tbsp", "category": "pantry" },
        { "name": "garlic", "quantity": 2, "unit": "cloves", "category": "produce" }
      ],
      "instructions": "1. Cook pasta according to package directions\n2. Slice zucchini, halve tomatoes\n3. Sauté garlic in olive oil\n4. Add vegetables, cook until tender\n5. Toss with drained pasta\n6. Top with parmesan",
      "prepTime": 10,
      "cookTime": 20,
      "servings": 4,
      "categories": ["vegetarian", "italian"]
    }
  ]
}
```

**Ingredient categories** (used for grocery list grouping):
- `produce` - Fresh fruits and vegetables
- `meat` - Meat, poultry, seafood
- `dairy` - Milk, cheese, eggs, butter
- `pantry` - Dry goods, oils, sauces, spices
- `frozen` - Frozen items

#### App State (In-memory, session-based)
```typescript
interface AppState {
  allRecipes: Recipe[]           // Loaded from recipes.json
  currentSelection: Recipe[]     // Currently displayed 3-4 recipes
  dismissedIds: Set<string>      // Recipe IDs dismissed this session (not persisted)
  groceryList: GroceryItem[]     // Generated grocery list
}
```

#### Selection (Stored in IndexedDB - optional, for history)
```typescript
interface SavedSelection {
  id: string
  date: string                   // When selection was confirmed
  recipeIds: string[]            // The 3-4 recipes user chose
}
```

#### GroceryList (Stored in IndexedDB)
```typescript
interface GroceryList {
  id: string
  weekStartDate: string
  items: GroceryItem[]
  createdAt: string
}

interface GroceryItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string        // produce, dairy, meat, pantry, frozen
  purchased: boolean
}
```

### 3.4 Data Flow

| Data | Source | Storage |
|------|--------|---------|
| Recipes | `recipes.json` static file | Read-only, loaded at app start |
| Current Selection | Random or restored from storage | localStorage (persists across refresh) |
| Dismissed Recipes | User clicks delete | localStorage (persists across refresh) |
| Grocery List | Generated from selection | In-memory (view only, export to PDF) |

**State Persistence:**
- Selected recipe IDs are saved to localStorage
- Dismissed recipe IDs are saved to localStorage
- On page refresh, state is restored from localStorage
- "Start Fresh" button clears localStorage and generates new random selection

**Dismissed List Behavior:**
- When user deletes a recipe, it's added to dismissed list
- Auto-replacement (when count ≤ 4) excludes dismissed recipes
- Search modal shows dismissed recipes (user can re-add if desired)
- When user adds a dismissed recipe via search, it's removed from dismissed list

### 3.5 Key Algorithms

#### Initial Selection Algorithm
```
1. Load all recipes from recipes.json
2. Shuffle the recipe array randomly
3. Pick first 3-4 recipes
4. Display as current selection
5. Initialize dismissedIds as empty Set
```

#### Replace Recipe Algorithm (on delete click)
```
1. Add clicked recipe ID to dismissedIds Set
2. Get available recipes = allRecipes.filter(r => !dismissedIds.has(r.id) && !currentSelection.includes(r))
3. If available recipes exist:
   a. Pick one randomly
   b. Replace the deleted recipe in currentSelection
   c. Animate the swap
4. If no recipes available:
   a. Show message "No more recipes available"
   b. Remove the card without replacement
```

#### Grocery List Aggregation
```
1. Get all recipes in currentSelection
2. For each recipe:
   a. Get all ingredients
   b. (Optional: multiply by servings if user can adjust)
3. Group ingredients by normalized name (lowercase, trimmed)
4. Sum quantities for matching ingredients with same unit
5. Categorize by grocery section (produce, dairy, meat, pantry, frozen)
6. Sort within each category alphabetically
7. Return categorized list
```

### 3.6 Deployment

**Project Structure (after build):**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
├── recipes.json          # Your recipe data
└── favicon.ico
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name food-planner.local;
    root /var/www/food-planner;
    index index.html;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache the main files (allow updates)
    location ~* \.(html|json)$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

**Deployment Steps:**
1. Build the app: `npm run build`
2. Copy `dist/` contents to `/var/www/food-planner/`
3. Add your `recipes.json` file to the same directory
4. Reload nginx: `sudo nginx -s reload`

### 3.7 Development Scripts

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build --configuration production",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "format": "prettier --write \"src/**/*.{ts,html,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,html,css,json}\""
  }
}
```

### 3.8 CI/CD Pipeline (GitHub Actions)

**.github/workflows/ci.yml:**
```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Check formatting
        run: npm run format:check

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
```

### 3.9 Linting & Formatting Configuration

**ESLint** - enforces code quality rules:
- Angular ESLint recommended rules
- TypeScript strict mode
- No unused variables
- Consistent imports

**Prettier** - enforces consistent formatting:
- Single quotes
- 2-space indentation
- Trailing commas
- 100 char line width

### 3.10 Future Enhancements (Out of Scope for v1)

- Recipe editor UI (to modify recipes.json via the app)
- Recipe import from URLs
- Nutritional information tracking
- Cloud sync across devices
- Integration with grocery delivery services
- Voice assistant integration

---

## 4. User Interface Mockup Descriptions

### Main View (Recipe Selection)
```
┌─────────────────────────────────────────────────────┐
│  Weekly Meal Planner                 [ Start Fresh ]│
│                                                      │
│  Your selections (4):                    [ + Add ]  │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Recipe  │  │  Recipe  │  │  Recipe  │          │
│  │  Image   │  │  Image   │  │  Image   │          │
│  │          │  │          │  │          │          │
│  │ Chicken  │  │ Pasta    │  │ Stir Fry │          │
│  │ Curry    │  │ Primaver │  │ Veggies  │          │
│  │    [X]   │  │    [X]   │  │    [X]   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                      │
│  Click a card for details. Click X to remove/replace│
│                                                      │
│  [ Download Recipes PDF ]  [ Generate Grocery List ] │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- **"Start Fresh" button** - clears all state, loads new random 4 recipes
- Recipe cards displayed in responsive grid (starts with 4)
- Each card shows: recipe image/placeholder, recipe name
- Delete icon (X) in corner of each card
- Clicking card opens detail modal
- Clicking X removes/replaces recipe (based on count)
- **"+ Add" button** - opens search modal to add more recipes
- "Download Recipes PDF" button - exports selected recipes
- "Generate Grocery List" button - navigates to grocery view

### Add Recipe Modal (Search)
```
┌─────────────────────────────────────────────────────┐
│  Add Recipe                                    [X]  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │ 🔍 Search recipes...                          │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ Beef Tacos                            [Add] │    │
│  ├─────────────────────────────────────────────┤    │
│  │ Grilled Salmon                        [Add] │    │
│  ├─────────────────────────────────────────────┤    │
│  │ Vegetable Soup                        [Add] │    │
│  ├─────────────────────────────────────────────┤    │
│  │ Mushroom Risotto                      [Add] │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  Showing recipes not in your current selection      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Search input to filter recipes by name
- List of available recipes:
  - Excludes currently selected recipes
  - Includes previously dismissed recipes (can re-add)
- "Add" button next to each recipe
- Clicking Add closes modal and adds recipe to selection

### Recipe Card States
- **Default:** Shows recipe image + name + delete icon
- **Hover:** Slight elevation/shadow, shows "View Details"
- **Replacing:** Fade out old, fade in new recipe

### Recipe Detail Modal
- Recipe name and image
- Prep time, cook time, servings info
- Full ingredients list with quantities
- Step-by-step cooking instructions
- Close button (X) to return to selection

### Grocery List View
```
┌─────────────────────────────────────────────────────┐
│  🛒  Grocery List                [ Download PDF ]   │
│                                                      │
│  PRODUCE                                             │
│  • Onions (3)                                       │
│  • Garlic (5 cloves)                                │
│  • Broccoli (2 cups)                                │
│  • Bell pepper (1)                                  │
│                                                      │
│  MEAT                                                │
│  • Chicken breast (500g)                            │
│                                                      │
│  DAIRY                                               │
│  • Parmesan cheese (50g)                            │
│                                                      │
│  PANTRY                                              │
│  • Soy sauce (3 tbsp)                               │
│  • Olive oil (5 tbsp)                               │
│  • Penne pasta (400g)                               │
│                                                      │
│              [ ← Back to Recipes ]                  │
└─────────────────────────────────────────────────────┘
```

**Elements:**
- Grouped by category with headers
- Read-only list (no editing)
- Download PDF button for printable version with checkboxes
- Back button to return to recipe selection

### PDF Export Formats

**Recipes PDF:**
```
┌─────────────────────────────────────────┐
│  Weekly Meal Plan - [Date]              │
│                                         │
│  ─────────────────────────────────────  │
│  CHICKEN CURRY                          │
│  Prep: 15 min | Cook: 30 min | Serves 4 │
│                                         │
│  Ingredients:                           │
│  • 500g chicken breast                  │
│  • 2 tbsp curry powder                  │
│  • 1 can coconut milk                   │
│  • ...                                  │
│                                         │
│  Instructions:                          │
│  1. Cut chicken into cubes...           │
│  2. Heat oil in pan...                  │
│  3. ...                                 │
│                                         │
│  ─────────────────────────────────────  │
│  PASTA PRIMAVERA                        │
│  ...                                    │
└─────────────────────────────────────────┘
```

**Grocery List PDF:**
```
┌─────────────────────────────────────────┐
│  Grocery List - [Date]                  │
│                                         │
│  PRODUCE                                │
│  ☐ Onions (3)                          │
│  ☐ Garlic (2 heads)                    │
│  ☐ Bell peppers (4)                    │
│                                         │
│  MEAT                                   │
│  ☐ Chicken breast (1 kg)               │
│  ☐ Ground beef (500g)                  │
│                                         │
│  DAIRY                                  │
│  ☐ Milk (1 L)                          │
│  ☐ Cheese (200g)                       │
│                                         │
│  PANTRY                                 │
│  ☐ Olive oil                           │
│  ☐ Soy sauce                           │
│  ...                                    │
└─────────────────────────────────────────┘
```

---

## 5. Development Phases

### Phase 1: Core MVP
- Load recipes from JSON file
- Display 3-4 random recipe cards
- Delete button replaces recipe with new one
- Track dismissed recipes in session
- Basic recipe detail modal

### Phase 2: Grocery List & PDF Export
- Generate grocery list from selected recipes
- Aggregate duplicate ingredients
- Categorize by section (produce, meat, etc.)
- Download recipes as PDF
- Download grocery list as PDF

### Phase 3: Polish & UX
- Mobile-responsive design
- Smooth animations for card replacement
- PWA support (optional)

---

## 6. File Structure

```
food-planner/
├── .github/
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
├── public/
│   └── recipes.json              # All your recipes (manually maintained)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── recipe-selection/ # Main view with recipe cards
│   │   │   ├── recipe-card/      # Individual recipe card with delete
│   │   │   ├── recipe-modal/     # Recipe details popup
│   │   │   ├── add-recipe-modal/ # Search and add recipes
│   │   │   └── grocery-list/     # Shopping list view (read-only)
│   │   ├── services/
│   │   │   ├── recipe.service.ts # Load recipes, manage state
│   │   │   └── pdf.service.ts    # Generate PDFs
│   │   ├── models/
│   │   │   └── recipe.model.ts   # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── grocery-generator.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.config.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .prettierignore               # Prettier ignore patterns
├── angular.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```
