import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { Recipe, GroceryList } from '../models/recipe.model';
import { capitalizeFirst, formatQuantity } from '../utils/grocery-generator';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  generateRecipesPdf(recipes: Recipe[]): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let yPos = margin;

    // Title
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Weekly Meal Plan', margin, yPos);
    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(today, margin, yPos);
    yPos += 15;

    // Recipes
    for (const recipe of recipes) {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = margin;
      }

      // Recipe name
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(recipe.name, margin, yPos);
      yPos += 7;

      // Prep/Cook time
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Prep: ${recipe.prepTime} min | Cook: ${recipe.cookTime} min | Serves: ${recipe.servings}`,
        margin,
        yPos
      );
      yPos += 8;

      // Ingredients header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Ingredients:', margin, yPos);
      yPos += 6;

      // Ingredients list
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      for (const ingredient of recipe.ingredients) {
        const text = `• ${capitalizeFirst(ingredient.name)} (${formatQuantity(ingredient.quantity, ingredient.unit)})`;
        doc.text(text, margin + 5, yPos);
        yPos += 5;

        if (yPos > 270) {
          doc.addPage();
          yPos = margin;
        }
      }
      yPos += 3;

      // Instructions header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Instructions:', margin, yPos);
      yPos += 6;

      // Instructions
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const instructions = recipe.instructions.split('\n');
      for (const line of instructions) {
        const wrappedLines = doc.splitTextToSize(line, contentWidth - 5);
        for (const wrappedLine of wrappedLines) {
          doc.text(wrappedLine, margin + 5, yPos);
          yPos += 5;

          if (yPos > 270) {
            doc.addPage();
            yPos = margin;
          }
        }
      }
      yPos += 10;

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
    }

    doc.save('weekly-meal-plan.pdf');
  }

  generateGroceryPdf(groceryList: GroceryList): void {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    // Title
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Grocery List', margin, yPos);
    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(today, margin, yPos);
    yPos += 15;

    const categories: Array<{ key: keyof GroceryList; label: string }> = [
      { key: 'produce', label: 'PRODUCE' },
      { key: 'meat', label: 'MEAT' },
      { key: 'dairy', label: 'DAIRY' },
      { key: 'pantry', label: 'PANTRY' },
      { key: 'frozen', label: 'FROZEN' },
    ];

    for (const { key, label } of categories) {
      const items = groceryList[key];
      if (items.length === 0) continue;

      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = margin;
      }

      // Category header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, yPos);
      yPos += 7;

      // Items
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      for (const item of items) {
        // Checkbox
        doc.rect(margin, yPos - 3, 4, 4);
        const text = `${capitalizeFirst(item.name)} (${formatQuantity(item.quantity, item.unit)})`;
        doc.text(text, margin + 7, yPos);
        yPos += 6;

        if (yPos > 270) {
          doc.addPage();
          yPos = margin;
        }
      }
      yPos += 5;
    }

    doc.save('grocery-list.pdf');
  }
}
