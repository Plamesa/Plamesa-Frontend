import { jsPDF } from 'jspdf';
import { GETIngredientInterface, GETRecipeInterface } from './interfaces';
import { NutrientsTypes, getUnitFromName } from './enums';
import { capitalizeFirstLetter } from '../utils/utils';

const getNutrientIngredientAmount = (ingredient: GETIngredientInterface, nutrientName: NutrientsTypes): number => {
  const nutrient = ingredient.nutrients.find(n => n.name === nutrientName);
  return nutrient ? nutrient.amount : 0;
};

const getNutrientRecipeAmount = (recipe: GETRecipeInterface, nutrientName: NutrientsTypes): number => {
  const nutrient = recipe.nutrients.find(n => n.name === nutrientName);
  return nutrient ? nutrient.amount : 0;
};

function needNewPage(posY: number, doc: jsPDF, margin: number = 0) {
  if (posY + margin > 280) { // Espacio en la página actual
    doc.addPage();
    return 20; // Reiniciar posY
  }
  return posY;
}

export function generateIngredientsPDF(ingredient: GETIngredientInterface, amount: number) {
  let posY: number = 20
  const marginNormalX: number = 20
  const marginLargeX: number = 25
  const marginExtraLargeX: number = 30
  const doc = new jsPDF();

  // Añadir título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(capitalizeFirstLetter(ingredient.name), marginNormalX, posY);
  posY += 10;

  // Añadir información básica
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Valores correspondientes para: ${amount} ${ingredient.unit}`, marginNormalX, posY);
  posY += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Grupo de comida:', marginLargeX, posY);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${ingredient.foodGroup}`, 62, posY);
  posY += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Coste estimado:', marginLargeX, posY);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${(ingredient.estimatedCost * amount / ingredient.amount).toFixed(2)}€`, 60, posY);
  posY += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Propietario:', marginLargeX, posY);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${capitalizeFirstLetter(ingredient.ownerUser.username)}`, 50, posY);
  posY += 15;


  // Añadir alérgenos
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Alérgenos', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  posY += 10;

  doc.setFontSize(12);
  if (ingredient.allergens.length > 0) {
    ingredient.allergens.forEach((allergen) => {
      doc.text(`• ${allergen}`, marginExtraLargeX, posY);
      posY += 10;
    });
  } else {
    doc.text('No tiene alérgenos', marginExtraLargeX, posY);
    posY += 10;
  }
  posY += 5;

  // Añadir nutrientes en dos columnas
  const nutrients1 = [
    NutrientsTypes.Energia, NutrientsTypes.Proteinas, NutrientsTypes.Carbohidratos,
    NutrientsTypes.GrasaTotal, NutrientsTypes.Sal, NutrientsTypes.Azucar,
    NutrientsTypes.GrasaSaturada, NutrientsTypes.Fibra, NutrientsTypes.Colesterol
  ];
  const nutrients2 = [
    NutrientsTypes.Calcio, NutrientsTypes.Hierro, NutrientsTypes.Potasio,
    NutrientsTypes.Magnesio, NutrientsTypes.Sodio, NutrientsTypes.Fosforo,
    NutrientsTypes.Yodo, NutrientsTypes.Selenio, NutrientsTypes.Zinc,
    NutrientsTypes.VitaminaA, NutrientsTypes.VitaminaB6, NutrientsTypes.VitaminaB12,
    NutrientsTypes.VitaminaC, NutrientsTypes.VitaminaD, NutrientsTypes.VitaminaE
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Información Nutricional', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  posY += 10;

  for(let i = 0; i < nutrients2.length; i++) {
    posY = needNewPage(posY, doc);

    if (i < nutrients1.length) {
      doc.text(
        `${nutrients1[i]}: ${(getNutrientIngredientAmount(ingredient, nutrients1[i]) * amount / ingredient.amount).toFixed(2)} ${getUnitFromName(nutrients1[i])}`,
        marginLargeX,
        posY
      );
    }

    doc.text(
      `${nutrients2[i]}: ${(getNutrientIngredientAmount(ingredient, nutrients2[i]) * amount / ingredient.amount).toFixed(2)} ${getUnitFromName(nutrients2[i])}`,
      115,
      posY
    );

    posY += 10;
  }

  doc.save(`${capitalizeFirstLetter(ingredient.name)} PLAMESA.pdf`);
};




export function generateRecipePDF(recipe: GETRecipeInterface, services: number) {
  let posY: number = 20
  const marginNormalX: number = 20
  const marginLargeX: number = 25
  const marginExtraLargeX: number = 30
  const doc = new jsPDF();

  // Añadir título
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  const nameLines: string[] = doc.splitTextToSize(`${capitalizeFirstLetter(recipe.name)}`, 165);
  nameLines.forEach(line => {
    doc.text(line, marginNormalX, posY);
    posY += 10;
  });

  // Añadir información básica
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Valores correspondientes para: ${services} personas`, marginNormalX, posY);
  posY += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Tipo de comida:', marginLargeX, posY);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${recipe.foodType}`, 60, posY);
  posY += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Tiempo de preparación:', marginLargeX, posY);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${recipe.preparationTime} minutos`, 75, posY);
  posY += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Coste estimado:', marginLargeX, posY);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${(recipe.estimatedCost * services / recipe.numberService).toFixed(2)}€`, 60, posY);
  posY += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Propietario:', marginLargeX, posY);
  doc.setFont('helvetica', 'normal');
  doc.text(` ${capitalizeFirstLetter(recipe.ownerUser.username)}`, 50, posY);
  posY += 15;


  // Añadir ingredientes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Ingredientes', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  posY += 10;

  doc.setFontSize(12);
  recipe.ingredients.forEach((ingredient) => {
    posY = needNewPage(posY, doc);
    doc.text(`• ${capitalizeFirstLetter(ingredient.ingredientID.name)}: ${ingredient.amount * services / recipe.numberService} ${ingredient.ingredientID.unit}`, marginExtraLargeX, posY);
    posY += 10;
  });
  posY += 5;


  // Añadir Utensilios de Cocina
  posY = needNewPage(posY, doc, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Utensilios de Cocina', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  posY += 10;

  doc.setFontSize(12);
  if (recipe.cookware.length > 0) {
    recipe.cookware.forEach((cookware) => {
      posY = needNewPage(posY, doc);
      doc.text(`• ${capitalizeFirstLetter(cookware)}`, marginExtraLargeX, posY);
      posY += 10;
    });
  } else {
    doc.text('No tiene utensilios de cocina', marginExtraLargeX, posY);
    posY += 10;
  }
  posY += 5;


  // Añadir Instrucciones
  posY = needNewPage(posY, doc, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Instrucciones', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  posY += 10;

  doc.setFontSize(12);
  recipe.instructions.forEach((instruction, index) => {
    const instructionLines: string[] = doc.splitTextToSize(`${index + 1}. ${instruction}`, 165);
    instructionLines.forEach(line => {
      posY = needNewPage(posY, doc);
      doc.text(line, marginExtraLargeX, posY);
      posY += 10;
    });
  });
  posY += 5;


  // Añadir Comentarios
  posY = needNewPage(posY, doc, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Comentarios', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  posY += 10;
  doc.setFontSize(12);
  if (recipe.comments) {
    posY = needNewPage(posY, doc, 20);
    const comments: string[] = doc.splitTextToSize(recipe.comments, 165);
    comments.forEach(line => {
      posY = needNewPage(posY, doc, 10);
      doc.text(line, marginLargeX, posY);
      posY += 10;
    });
  } else {
    doc.text('No tiene comentarios', marginExtraLargeX, posY);
    posY += 10;
  }
  posY += 5;


  // Añadir alérgenos
  posY = needNewPage(posY, doc, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Alérgenos', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  posY += 10;

  doc.setFontSize(12);
  if (recipe.allergens.length > 0) {
    recipe.allergens.forEach((allergen) => {
      posY = needNewPage(posY, doc);
      doc.text(`• ${allergen}`, marginExtraLargeX, posY);
      posY += 10;
    });
  } else {
    doc.text('No tiene alérgenos', marginExtraLargeX, posY);
    posY += 10;
  }
  posY += 5;

  // Añadir nutrientes en dos columnas
  const nutrients1 = [
    NutrientsTypes.Energia, NutrientsTypes.Proteinas, NutrientsTypes.Carbohidratos,
    NutrientsTypes.GrasaTotal, NutrientsTypes.Sal, NutrientsTypes.Azucar,
    NutrientsTypes.GrasaSaturada, NutrientsTypes.Fibra, NutrientsTypes.Colesterol
  ];
  const nutrients2 = [
    NutrientsTypes.Calcio, NutrientsTypes.Hierro, NutrientsTypes.Potasio,
    NutrientsTypes.Magnesio, NutrientsTypes.Sodio, NutrientsTypes.Fosforo,
    NutrientsTypes.Yodo, NutrientsTypes.Selenio, NutrientsTypes.Zinc,
    NutrientsTypes.VitaminaA, NutrientsTypes.VitaminaB6, NutrientsTypes.VitaminaB12,
    NutrientsTypes.VitaminaC, NutrientsTypes.VitaminaD, NutrientsTypes.VitaminaE
  ];

  
  posY = needNewPage(posY, doc, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Información Nutricional', marginNormalX, posY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  posY += 10;

  for(let i = 0; i < nutrients2.length; i++) {
    posY = needNewPage(posY, doc);

    if (i < nutrients1.length) {
      doc.text(
        `${nutrients1[i]}: ${(getNutrientRecipeAmount(recipe, nutrients1[i]) * services / recipe.numberService).toFixed(2)} ${getUnitFromName(nutrients1[i])}`,
        marginLargeX,
        posY
      );
    }

    doc.text(
      `${nutrients2[i]}: ${(getNutrientRecipeAmount(recipe, nutrients2[i]) * services / recipe.numberService).toFixed(2)} ${getUnitFromName(nutrients2[i])}`,
      115,
      posY
    );

    posY += 10;
  }

  doc.save(`${capitalizeFirstLetter(recipe.name)} PLAMESA.pdf`);
};
