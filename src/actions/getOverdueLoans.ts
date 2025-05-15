import { Prestamo, PrestamoEstado } from "@/types";

export const getOverdueLoans = async (): Promise<Prestamo[]> => [
  {
    id: "1",
    libroId: "L001",
    LibroNombre: "Fahrenheit 451",
    autor: "Ray Bradbury",
    usuarioId: "007",
    usuarioNombre: "Laura González",
    fechaPrestamo: "2025-02-01",
    fechaDevolucionPrevista: "2025-02-15",
    fechaDevolucionReal: undefined,
    estado: PrestamoEstado.VENCIDO,
    renovaciones_hechas: 0,
    diasRetraso: 10,
    notas: "Libro no devuelto a tiempo"
  },
  {
    id: "2",
    libroId: "L002",
    LibroNombre: "El retrato de Dorian Gray",
    autor: "Oscar Wilde",
    usuarioId: "008",
    usuarioNombre: "Eduardo Ramírez",
    fechaPrestamo: "2025-02-10",
    fechaDevolucionPrevista: "2025-02-24",
    fechaDevolucionReal: undefined,
    estado: PrestamoEstado.VENCIDO,
    renovaciones_hechas: 1,
    diasRetraso: 5,
    notas: "Usuario avisó retraso"
  },
  {
    id: "3",
    libroId: "L003",
    LibroNombre: "Cumbres Borrascosas",
    autor: "Emily Brontë",
    usuarioId: "009",
    usuarioNombre: "Sofía Torres",
    fechaPrestamo: "2025-02-20",
    fechaDevolucionPrevista: "2025-03-06",
    fechaDevolucionReal: undefined,
    estado: PrestamoEstado.VENCIDO,
    renovaciones_hechas: 0,
    diasRetraso: 2,
    notas: ""
  }
];