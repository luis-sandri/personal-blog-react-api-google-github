export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .replace(/\s+/g, '-') // Espaços para hífens
    .replace(/[^\w-]+/g, '') // Remove não-alfanuméricos
    .replace(/--+/g, '-') // Múltiplos hífens para um
    .replace(/^-+/, '') // Remove hífen do início
    .replace(/-+$/, ''); // Remove hífen do fim
}
