import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// types/index.ts

// Estado del préstamo
export enum PrestamoEstado {
  ACTIVO = 'ACTIVO',
  DEVUELTO = 'DEVUELTO',
  VENCIDO = 'VENCIDO'
}

// Ubicación física del libro
export enum LibroUbicacion {
  GRADO = "grado",
  CIENCIAS_BIOMEDICAS = "ciencias_biomedicas"
}

// Modelo de Libro
export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  disponible: boolean;
  editorial?: string;
  anioPublicacion?: number;
  genero?: string;
  disponibles: number;
  imagen?: string;
  descripcion?: string;
  ubicacion: LibroUbicacion; // Ubicación física en la biblioteca
}

// Modelo de Préstamo
export interface Prestamo {
  autor: any;
  id: string;
  libroId: string;
  usuarioId: string;
  usuarioNombre: string; // Nombre del usuario
  fechaPrestamo: string;
  LibroNombre: string; // Nombre del libro
  fechaDevolucionPrevista: string;
  fechaDevolucionReal?: string;
  estado: PrestamoEstado;
  renovaciones_hechas: number;
  diasRetraso?: number;
  notas?: string;
}

// Roles de usuario
export enum UsuarioRol {
  ESTUDIANTE = "estudiante",
  PROFESOR = "profesor",
  BIBLIOTECARIO = "bibliotecario"
}

// Estado de la cuenta de usuario
export enum UsuarioEstado {
  ACTIVO = "activo",
  SUSPENDIDO = "suspendido",
  INACTIVO = "inactivo"
}

// Modelo de Usuario
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  idTarjetaAustral: string; // Número de tarjeta Austral
  rol: UsuarioRol;
  estado: UsuarioEstado;
  fechaRegistro: string; // Formato fecha YYYY-MM-DD
  carrera?: string; // Aplica para estudiantes
  departamento?: string; // Aplica para profesores
  prestamosActivos?: Prestamo[]; // Lista de préstamos activos
  historialPrestamos?: Prestamo[]; // Historial de préstamos
  limitePrestamos: number; // Número máximo de préstamos simultáneos permitidos
}

// Enums y definición de interfaces

// Información adicional que se obtendrá de otros endpoints
export interface InfoAdicionalPrestamo {
  libro: string;
  autor: string;
  usuario: string;
}

export interface Paginacion {
  paginaActual: number;
  totalPaginas: number;
  totalLibros: number;
  librosPorPagina: number;
}

export interface LibrosResponse {
  libros: Libro[];
  paginacion: Paginacion;
}
