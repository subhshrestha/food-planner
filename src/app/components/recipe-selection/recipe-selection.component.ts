import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GroceryList, Recipe } from '../../models/recipe.model';
import { PdfService } from '../../services/pdf.service';
import { RecipeService } from '../../services/recipe.service';
import { generateGroceryList } from '../../utils/grocery-generator';
import { AddRecipeModalComponent } from '../add-recipe-modal/add-recipe-modal.component';
import { GroceryListComponent } from '../grocery-list/grocery-list.component';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { RecipeModalComponent } from '../recipe-modal/recipe-modal.component';

@Component({
  selector: 'app-recipe-selection',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ConfirmDialogModule,
    RecipeCardComponent,
    RecipeModalComponent,
    AddRecipeModalComponent,
    GroceryListComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './recipe-selection.component.html',
  styleUrl: './recipe-selection.component.scss',
})
export class RecipeSelectionComponent {
  recipeService = inject(RecipeService);
  private pdfService = inject(PdfService);
  private confirmationService = inject(ConfirmationService);

  // View state
  currentView = signal<'selection' | 'grocery'>('selection');

  // Modal state
  showRecipeModal = signal<boolean>(false);
  selectedRecipeForModal = signal<Recipe | null>(null);
  showAddModal = signal<boolean>(false);

  // Grocery list
  groceryList = signal<GroceryList | null>(null);

  // Event handlers
  handleDeleteRecipe(recipeId: string): void {
    this.recipeService.dismissRecipe(recipeId);
  }

  handleRecipeClick(recipe: Recipe): void {
    this.selectedRecipeForModal.set(recipe);
    this.showRecipeModal.set(true);
  }

  handleAddRecipe(recipe: Recipe): void {
    this.recipeService.addRecipe(recipe);
  }

  openAddModal(): void {
    this.showAddModal.set(true);
  }

  // PDF downloads
  downloadRecipesPdf(): void {
    this.pdfService.generateRecipesPdf(this.recipeService.selectedRecipes());
  }

  downloadGroceryPdf(): void {
    const list = this.groceryList();
    if (list) {
      this.pdfService.generateGroceryPdf(list);
    }
  }

  // Navigation
  generateGroceryList(): void {
    const list = generateGroceryList(this.recipeService.selectedRecipes());
    this.groceryList.set(list);
    this.currentView.set('grocery');
  }

  backToRecipes(): void {
    this.currentView.set('selection');
  }

  // Reset
  confirmReset(): void {
    this.confirmationService.confirm({
      message: 'This will clear all your selections and start fresh. Are you sure?',
      header: 'Start Fresh',
      icon: 'pi pi-refresh',
      acceptLabel: 'Yes, Start Fresh',
      rejectLabel: 'Cancel',
      accept: () => {
        this.recipeService.resetAll();
        this.groceryList.set(null);
        this.currentView.set('selection');
      },
    });
  }

  constructor() {}
}
