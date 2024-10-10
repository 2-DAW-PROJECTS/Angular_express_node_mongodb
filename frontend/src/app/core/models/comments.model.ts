export interface Comment {
    id: string;
    body: string;
    createdAt: string;
    updatedAt: string; // Agregamos updatedAt para mantener la información completa
    author: {
        id: string;      // Agregamos id para el autor
        username: string;
        email: string;   // Incluimos email para futuras referencias, si es necesario
        bio: string;
        image?: string;
        city: string;    // Ciudad
        aboutMe: string; // Información adicional
        skills: string[]; // Habilidades
    };
}
