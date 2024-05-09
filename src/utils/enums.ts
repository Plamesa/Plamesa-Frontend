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