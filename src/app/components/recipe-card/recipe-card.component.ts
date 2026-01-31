import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  recipe = input.required<Recipe>();

  remove = output<string>();
  selectRecipe = output<Recipe>();

  handleDelete(event: Event): void {
    event.stopPropagation();
    this.remove.emit(this.recipe().id);
  }

  handleClick(): void {
    this.selectRecipe.emit(this.recipe());
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x300/fed7aa/ea580c?text=Recipe';
  }
}
