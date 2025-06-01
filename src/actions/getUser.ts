import { Usuario, UsuarioRol, UsuarioEstado, PrestamoEstado } from "@/types";


export async function getUser(userId: string): Promise<Usuario> {
  // Mock data for development
  const mockUsuario: Usuario = {
    id: userId,
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@austral.edu.ar",
    idTarjetaAustral: "A2024001",
    rol: UsuarioRol.ESTUDIANTE,
    estado: UsuarioEstado.ACTIVO,
    fechaRegistro: "2024-01-15",
    carrera: "Ingeniería Informática",
    limitePrestamos: 5,
    prestamosActivos: [
      {
        id: "1",
        libroId: "L001",
        LibroNombre: "Algoritmos y Estructuras de Datos",
        autor: "Thomas H. Cormen",
        usuarioId: userId,
        usuarioNombre: "Juan Pérez",
        fechaPrestamo: "2024-03-01",
        fechaDevolucionPrevista: "2024-03-15",
        estado: PrestamoEstado.ACTIVO,
        renovaciones_hechas: 0,
        notas: ""
      }
    ],
    historialPrestamos: [
      {
        id: "2",
        libroId: "L002",
        LibroNombre: "Cálculo de Una Variable",
        autor: "James Stewart",
        usuarioId: userId,
        usuarioNombre: "Juan Pérez",
        fechaPrestamo: "2024-02-01",
        fechaDevolucionPrevista: "2024-02-15",
        fechaDevolucionReal: "2024-02-14",
        estado: PrestamoEstado.DEVUELTO,
        renovaciones_hechas: 0,
        notas: "Devuelto en buen estado"
      },
      {
        id: "3",
        libroId: "L003",
        LibroNombre: "Física Universitaria",
        autor: "Sears Zemansky",
        usuarioId: userId,
        usuarioNombre: "Juan Pérez",
        fechaPrestamo: "2024-01-15",
        fechaDevolucionPrevista: "2024-01-29",
        fechaDevolucionReal: "2024-01-28",
        estado: PrestamoEstado.DEVUELTO,
        renovaciones_hechas: 1,
        notas: "Renovado una vez"
      }
    ]
  };

  // Return mock data
  return mockUsuario;

  // Commented implementation with BasicFetch
  /*
  try {
    const response = await basicFetch(`/api/usuarios/${userId}`, "GET");
    return response as Usuario;
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    throw error;
  }
  */
} 