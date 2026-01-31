import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GroceryList } from '../../models/recipe.model';
import { capitalizeFirst, formatQuantity } from '../../utils/grocery-generator';

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.scss',
})
export class GroceryListComponent {
  groceryList = input.required<GroceryList>();

  back = output<void>();
  downloadPdf = output<void>();

  categories: Array<{ key: keyof GroceryList; label: string; icon: string }> = [
    { key: 'produce', label: 'Produce', icon: 'pi-apple' },
    { key: 'meat', label: 'Meat', icon: 'pi-heart' },
    { key: 'dairy', label: 'Dairy', icon: 'pi-box' },
    { key: 'pantry', label: 'Pantry', icon: 'pi-home' },
    { key: 'frozen', label: 'Frozen', icon: 'pi-snowflake' },
  ];

  formatItem(quantity: number, unit: string): string {
    return formatQuantity(quantity, unit);
  }

  capitalize(str: string): string {
    return capitalizeFirst(str);
  }

  getTotalItems(): number {
    const list = this.groceryList();
    return (
      list.produce.length +
      list.meat.length +
      list.dairy.length +
      list.pantry.length +
      list.frozen.length
    );
  }
}
