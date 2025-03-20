import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// types/index.ts

// Estado del préstamo
export enum PrestamoEstado {
  ACTIVO = "activo",
  VENCIDO = "vencido",
  DEVUELTO = "devuelto"
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
  isbn?: string;
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
  id: string;
  libroId: string;
  usuarioId: string;
  fechaPrestamo: string; // Formato fecha YYYY-MM-DD
  fechaDevolucionPrevista: string; // Formato fecha YYYY-MM-DD
  fechaDevolucionReal?: string; // Formato fecha YYYY-MM-DD, sólo cuando se devuelve
  estado: PrestamoEstado;
  renovaciones_hechas: number; // Número de veces que se ha renovado
  diasRetraso?: number; // Días de retraso, si aplica
  notas?: string; // Notas adicionales sobre el préstamo
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