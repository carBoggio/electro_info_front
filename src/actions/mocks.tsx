import { Libro, LibroUbicacion, Prestamo, PrestamoEstado } from "@/types";

// Datos de ejemplo de libros como lista
export const LIBROS_LISTA: Libro[] = [
  {
    id: 'L001',
    titulo: "Fahrenheit 451",
    autor: "Ray Bradbury",
    disponibles: 2,
    ubicacion: LibroUbicacion.GRADO,
    isbn: "",
    disponible: false
  },
  {
    id: 'L002',
    titulo: "El retrato de Dorian Gray",
    autor: "Oscar Wilde",
    disponibles: 1,
    ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS,
    isbn: "",
    disponible: false
  },
  {
    id: 'L003',
    titulo: "Cumbres Borrascosas",
    autor: "Emily Brontë",
    disponibles: 3,
    ubicacion: LibroUbicacion.GRADO,
    isbn: "",
    disponible: false
  },
  {
    id: 'L004',
    titulo: "El lobo estepario",
    autor: "Hermann Hesse",
    disponibles: 0,
    ubicacion: LibroUbicacion.GRADO,
    isbn: "",
    disponible: false
  },
  {
    id: 'L005',
    titulo: "Mujercitas",
    autor: "Louisa May Alcott",
    disponibles: 2,
    ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS,
    isbn: "",
    disponible: false
  },
  {
    id: 'L006',
    titulo: "Crimen y castigo",
    autor: "Fiódor Dostoievski",
    disponibles: 1,
    ubicacion: LibroUbicacion.GRADO,
    isbn: "",
    disponible: false
  },
  {
    id: 'L007',
    titulo: "Orgullo y prejuicio",
    autor: "Jane Austen",
    disponibles: 4,
    ubicacion: LibroUbicacion.GRADO,
    isbn: "",
    disponible: false
  },
  {
    id: 'L008',
    titulo: "El Alquimista",
    autor: "Paulo Coelho",
    disponibles: 2,
    ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS,
    isbn: "",
    disponible: false
  }
];

// Mapeo simple de IDs a nombres de usuarios
export const USUARIOS: Record<string, string> = {
  '001': "Laura González",
  '002': "Eduardo Ramírez",
  '003': "Sofía Torres",
  '004': "Diego Morales",
  '005': "Ana Silva",
  '006': "Carlos Méndez",
  '007': "María Jiménez",
  '008': "Roberto Sánchez"
};

// Datos de ejemplo de préstamos
export const PRESTAMOS_BASE: Prestamo[] = [
  {
    id: "1",
    libroId: "L001",
    LibroNombre: "Fahrenheit 451",
    autor: "Ray Bradbury",
    usuarioId: "001",
    usuarioNombre: "Laura González",
    fechaPrestamo: "2025-01-15",
    fechaDevolucionPrevista: "2025-01-29",
    fechaDevolucionReal: "2025-01-28",
    estado: PrestamoEstado.DEVUELTO,
    renovaciones_hechas: 0,
    diasRetraso: 0,
    notas: "Libro devuelto en perfectas condiciones"
  },
  {
    id: "2",
    libroId: "L002",
    LibroNombre: "El retrato de Dorian Gray",
    autor: "Oscar Wilde",
    usuarioId: "002",
    usuarioNombre: "Eduardo Ramírez",
    fechaPrestamo: "2025-02-01",
    fechaDevolucionPrevista: "2025-02-15",
    fechaDevolucionReal: undefined,
    estado: PrestamoEstado.ACTIVO,
    renovaciones_hechas: 0,
    diasRetraso: 0,
    notas: "Primera vez que el usuario solicita este libro"
  },
  {
    id: "3",
    libroId: "L003",
    LibroNombre: "Cumbres Borrascosas",
    autor: "Emily Brontë",
    usuarioId: "003",
    usuarioNombre: "Sofía Torres",
    fechaPrestamo: "2025-01-20",
    fechaDevolucionPrevista: "2025-02-03",
    fechaDevolucionReal: undefined,
    estado: PrestamoEstado.VENCIDO,
    renovaciones_hechas: 0,
    diasRetraso: 10,
    notas: "Usuario contactado por email el 04/02"
  }
];