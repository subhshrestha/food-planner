import { Component } from '@angular/core';
import { RecipeSelectionComponent } from './components/recipe-selection/recipe-selection.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecipeSelectionComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
