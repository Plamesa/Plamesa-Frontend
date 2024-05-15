// Definición del enum Allergen
export enum Allergen {
  Cereales = "Cereales con gluten",
  Crustaceos = "Crustáceos y productos a base de crustáceos",
  Huevos = "Huevos y productos derivados",
  Pescado = "Pescado y productos a base de pescados",
  CacahuetesFrutosSecos = "Cacahuetes, productos a base de cacahuetes y frutos secos",
  Soja = "Soja y productos a base de soja",
  Leche = "Leche y sus derivados (incluida la lactosa)",
  FrutosCascara = "Frutos de cáscara y productos derivados",
  Apio = "Apio y productos derivados",
  Mostaza = "Mostaza y productos a base de mostaza",
  Sesamo = "Granos o semillas de sésamo y productos a base de sésamo",
  DioxidoAzufre = "Dióxido de azufre y sulfitos",
  Altramuces = "Altramuces y productos a base de altramuces",
  Moluscos = "Moluscos y crustáceos y productos a base de estos",
}

// Definición del enum IncompatibilidadAlimenticia
export enum Diet {
  Diabeticos = "No adecuado para diabeticos", // (alto contenido de azúcares o carbohidratos)
  Vegetarianos = "No adecuado para vegetarianos", // (contiene carne o pescado)
  Veganos = "No adecuado para veganos", // (contiene ingredientes de origen animal)
  Vacio = ""
}

export enum Gender {
  Masculino = "Masculino",
  Femenino = "Femenino",
  Vacio = ''
}

export enum ActivityLevel {
  Sedentario = "Sedentario", //(poco o ningún ejercicio): 1.2
  Ligero = "Ligero", // (ejercicio ligero o deportes 1-3 días por semana): 1.375
  Moderado = "Moderado", // (ejercicio moderado o deportes 3-5 días por semana): 1.55
  Activo = "Activo", //(ejercicio intenso o deportes 6-7 días por semana): 1.725
  MuyActivo = "Muy activo", // (ejercicio muy intenso, entrenamiento físico diario o dos veces al día): 1.9
  Vacio = ''
}

// Definición del enum FoodGroup
export enum FoodGroup {
  Lacteos = "Lácteos y derivados",
  Huevos = "Huevos y derivados",
  Carnicos = "Cárnicos y derivados",
  Pescados = "Pescados, moluscos, reptiles, crustáceos y derivados",
  Grasas = "Grasas y aceites",
  Cereales = "Cereales y derivados",
  Legumbres = "Legumbres, semillas, frutos secos y derivados",
  Verduras = "Verduras, hortalizas y derivados",
  Frutas = "Frutas y derivados",
  Azucar = "Azúcar, chocolate y derivados",
  Bebidas = "Bebidas (no lácteas)",
  Miscelanea = "Miscelánea",
  Otro = "Otro",
}

export enum NutrientsTypes {
  Energia = "Energía",
  // Macronutrientes
  Proteinas = "Proteinas",
  Carbohidratos = "Carbohidratos",
  GrasaTotal = "Grasa Total",
  // Minerales
  Calcio = "Calcio",
  Hierro = "Hierro",
  Potasio = "Potasio",
  Magnesio = "Magnesio",
  Sodio = "Sodio",
  Fosforo = "Fósforo",
  Yodo = "Yodo",
  Selenio = "Selenio",
  Zinc = "Zinc",
  // Vitaminas
  VitaminaA = "Vitamina A",
  //VitaminaB1 = "Vitamina B1",
  //VitaminaB2 = "Vitamina B2",
  VitaminaB6 = "Vitamina B6",
  VitaminaB12 = "Vitamina B12",
  VitaminaC = "Vitamina C",
  VitaminaD = "Vitamina D",
  VitaminaE = "Vitamina E",
  // Varios
  Sal = "Sal",
  Azucar = "Azúcares",
  GrasaSaturada = "Grasas Saturadas",
  Fibra = "Fibra",
  Colesterol = "Colesterol",
}

export interface Nutrient {
  name: NutrientsTypes;
  amount: number;
  unit: string;
}

/**
 * Función para obtener la unidad según el nombre del nutriente
 * @param nombre nombre del nutriente
 * @returns una string con la unidad correspondiente a ese nutriente
 */
export function getUnitFromName(name: NutrientsTypes): string {
  switch (name) {
    case NutrientsTypes.Energia:
      return "kcal";

    case NutrientsTypes.Proteinas:
    case NutrientsTypes.Carbohidratos:
    case NutrientsTypes.GrasaTotal:
    case NutrientsTypes.Sal:
    case NutrientsTypes.Azucar:
    case NutrientsTypes.GrasaSaturada:
    case NutrientsTypes.Fibra:
      return "g";

    case NutrientsTypes.VitaminaA:
    case NutrientsTypes.VitaminaD:
    case NutrientsTypes.VitaminaB12:
    case NutrientsTypes.Yodo:
    case NutrientsTypes.Selenio:
      return "ug";

    case NutrientsTypes.VitaminaB6:
    case NutrientsTypes.VitaminaC:
    case NutrientsTypes.VitaminaE:
    case NutrientsTypes.Calcio:
    case NutrientsTypes.Hierro:
    case NutrientsTypes.Potasio:
    case NutrientsTypes.Magnesio:
    case NutrientsTypes.Sodio:
    case NutrientsTypes.Fosforo:
    case NutrientsTypes.Zinc:
    case NutrientsTypes.Colesterol:
      return "mg";

    default:
      return "";
  }
}