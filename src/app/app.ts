import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipeSelectionComponent } from './components/recipe-selection/recipe-selection.component';
import { AppUpdateService } from './services/app-update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RecipeSelectionComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly appUpdateService = inject(AppUpdateService);

  constructor() {
    void this.appUpdateService;
  }
}
