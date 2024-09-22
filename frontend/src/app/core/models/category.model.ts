export interface Category {
    _id: string; // ID de la categoría
    name: string; // Nombre de la categoría
    description: string; // Descripción de la categoría
    isActive: boolean; // Estado de la categoría
    jobCount: number; // Número de trabajos
    slug: string; // Slug de la categoría
    image: string | null; // Imagen de la categoría (puede ser nula)
    subcategories: string[]; // Subcategorías
}


