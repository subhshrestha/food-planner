import { CommonModule } from '@angular/common';
import { Component, input, model, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './recipe-modal.component.html',
  styleUrl: './recipe-modal.component.scss',
})
export class RecipeModalComponent {
  recipe = input<Recipe | null>(null);
  visible = model<boolean>(false);

  closed = output<void>();

  closeModal(): void {
    this.visible.set(false);
    this.closed.emit();
  }

  getInstructionLines(): string[] {
    const r = this.recipe();
    if (!r) return [];
    return r.instructions.split('\n').filter(line => line.trim());
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x300/fed7aa/ea580c?text=Recipe';
  }
}
