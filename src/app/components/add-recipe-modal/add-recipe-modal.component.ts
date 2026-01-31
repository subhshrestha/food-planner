import { CommonModule } from '@angular/common';
import { Component, inject, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-add-recipe-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, InputTextModule, ButtonModule],
  templateUrl: './add-recipe-modal.component.html',
  styleUrl: './add-recipe-modal.component.scss',
})
export class AddRecipeModalComponent {
  private recipeService = inject(RecipeService);

  visible = model<boolean>(false);
  add = output<Recipe>();

  searchQuery = signal<string>('');
  searchResults = signal<Recipe[]>([]);

  onShow(): void {
    this.searchQuery.set('');
    this.updateResults();
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.updateResults();
  }

  private updateResults(): void {
    this.searchResults.set(this.recipeService.searchRecipes(this.searchQuery()));
  }

  addRecipe(recipe: Recipe): void {
    this.add.emit(recipe);
    this.visible.set(false);
  }

  closeModal(): void {
    this.visible.set(false);
  }
}
