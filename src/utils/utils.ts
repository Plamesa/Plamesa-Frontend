export function capitalizeFirstLetter(string: string) {
  return string.replace(/(^|\s)[a-záéíóúüñ]/g, (char: string) => char.toUpperCase());
}