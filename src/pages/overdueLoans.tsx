import { useState, useCallback } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Input } from "@heroui/input";
import DefaultLayout from "@/layouts/default";
import DropdownActionsLoans from "@/components/dropDownActionsLoans";
import { Prestamo, PrestamoEstado } from "@/types";

// Usamos una función auxiliar para mostrar información de libros/usuarios 
// que no están en la interfaz Prestamo
interface LibroInfo {
  titulo: string;
  autor: string;
}

const getLibroInfo = (libroId: string): LibroInfo => {
  // Esto sería reemplazado por una llamada a API o base de datos
  const librosInfo: Record<string, LibroInfo> = {
    'L001': { titulo: "Fahrenheit 451", autor: "Ray Bradbury" },
    'L002': { titulo: "El retrato de Dorian Gray", autor: "Oscar Wilde" },
    'L003': { titulo: "Cumbres Borrascosas", autor: "Emily Brontë" },
    'L004': { titulo: "El lobo estepario", autor: "Hermann Hesse" },
    'L005': { titulo: "Mujercitas", autor: "Louisa May Alcott" },
    'L006': { titulo: "Crimen y castigo", autor: "Fiódor Dostoievski" },
    'L007': { titulo: "Orgullo y prejuicio", autor: "Jane Austen" },
    'L008': { titulo: "El Alquimista", autor: "Paulo Coelho" },
    'L009': { titulo: "Cien años de soledad", autor: "Gabriel García Márquez" },
    'L010': { titulo: "El principito", autor: "Antoine de Saint-Exupéry" },
    'L011': { titulo: "La metamorfosis", autor: "Franz Kafka" },
    'L012': { titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes" },
    'L013': { titulo: "Rayuela", autor: "Julio Cortázar" },
    'L014': { titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón" },
    'L015': { titulo: "1984", autor: "George Orwell" }
  };
  return librosInfo[libroId] || { titulo: "Desconocido", autor: "Desconocido" };
};

const getUsuarioInfo = (usuarioId: string) => {
  // Esto sería reemplazado por una llamada a API o base de datos
  const usuariosInfo: { [key: string]: string } = {
    '007': "Laura González",
    '008': "Eduardo Ramírez",
    '009': "Sofía Torres",
    '010': "Diego Morales",
    '011': "Ana Silva",
    '012': "Carlos Méndez",
    '013': "María Jiménez",
    '014': "Roberto Sánchez",
    '015': "Lucía Fernández",
    '016': "Miguel Herrera",
    '017': "Isabel Ortega",
    '018': "Javier López",
    '019': "Carmen Ruiz",
    '020': "Alejandro Díaz",
    '021': "Patricia Gómez"
  };
  return usuariosInfo[usuarioId] || "Usuario Desconocido";
};

export default function OverdueLoansPage() {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Datos de ejemplo - en un caso real vendrían de una API
  const prestamosVencidosCompletos: Prestamo[] = [
    {
      id: "1",
      libroId: "L001",
      usuarioId: "007",
      fechaPrestamo: "2025-02-01",
      fechaDevolucionPrevista: "2025-02-15",
      fechaDevolucionReal: "2025-03-13",
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      diasRetraso: 26,
      notas: "Libro devuelto con retraso considerable"
    },
    {
      id: "2",
      libroId: "L002",
      usuarioId: "008",
      fechaPrestamo: "2025-02-10",
      fechaDevolucionPrevista: "2025-02-24",
      fechaDevolucionReal: "2025-03-13",
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      diasRetraso: 17,
      notas: "Usuario notificó retraso por viaje"
    },
    {
      id: "3",
      libroId: "L003",
      usuarioId: "009",
      fechaPrestamo: "2025-02-20",
      fechaDevolucionPrevista: "2025-03-06",
      fechaDevolucionReal: "2025-03-12",
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      diasRetraso: 6,
      notas: "Leve retraso en la devolución"
    },
    {
      id: "4",
      libroId: "L004",
      usuarioId: "010",
      fechaPrestamo: "2025-02-15",
      fechaDevolucionPrevista: "2025-03-01",
      fechaDevolucionReal: "2025-03-12",
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      diasRetraso: 11,
      notas: "Libro devuelto con algunas páginas marcadas"
    },
    {
      id: "5",
      libroId: "L005",
      usuarioId: "011",
      fechaPrestamo: "2025-02-25",
      fechaDevolucionPrevista: "2025-03-11",
      fechaDevolucionReal: "2025-03-12",
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      diasRetraso: 1,
      notas: "Entregado justo un día después"
    },
    {
      id: "6",
      libroId: "L006",
      usuarioId: "012",
      fechaPrestamo: "2025-01-30",
      fechaDevolucionPrevista: "2025-02-13",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      diasRetraso: 28,
      notas: "Usuario contactado varias veces sin respuesta"
    },
    {
      id: "7",
      libroId: "L007",
      usuarioId: "013",
      fechaPrestamo: "2025-02-05",
      fechaDevolucionPrevista: "2025-02-19",
      estado: PrestamoEstado.VENCIDO,
      renovaciones_hechas: 0,
      diasRetraso: 22,
      notas: "Usuario promete devolución próxima semana"
    },
    {
      id: "8",
      libroId: "L008",
      usuarioId: "014",
      fechaPrestamo: "2025-02-12",
      fechaDevolucionPrevista: "2025-02-26",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      diasRetraso: 15,
      notas: "Usuario reporta pérdida del libro"
    },
    {
      id: "9",
      libroId: "L009",
      usuarioId: "015",
      fechaPrestamo: "2025-02-18",
      fechaDevolucionPrevista: "2025-03-04",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      diasRetraso: 9,
      notas: "Usuario solicita más tiempo"
    },
    {
      id: "10",
      libroId: "L010",
      usuarioId: "016",
      fechaPrestamo: "2025-02-22",
      fechaDevolucionPrevista: "2025-03-08",
      estado: PrestamoEstado.VENCIDO,
      renovaciones_hechas: 0,
      diasRetraso: 5,
      notas: "Primera vez que el usuario se retrasa"
    },
    {
      id: "11",
      libroId: "L011",
      usuarioId: "017",
      fechaPrestamo: "2025-03-01",
      fechaDevolucionPrevista: "2025-03-15",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      notas: "Préstamo para trabajo de investigación"
    },
    {
      id: "12",
      libroId: "L012",
      usuarioId: "018",
      fechaPrestamo: "2025-03-05",
      fechaDevolucionPrevista: "2025-03-19",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      notas: "Usuario frecuente, sin historial de retrasos"
    },
    {
      id: "13",
      libroId: "L013",
      usuarioId: "019",
      fechaPrestamo: "2025-02-10",
      fechaDevolucionPrevista: "2025-02-24",
      estado: PrestamoEstado.VENCIDO,
      renovaciones_hechas: 1,
      notas: "Primera renovación solicitada por teléfono"
    },
    {
      id: "14",
      libroId: "L014",
      usuarioId: "020",
      fechaPrestamo: "2025-01-20",
      fechaDevolucionPrevista: "2025-02-03",
      estado: PrestamoEstado.VENCIDO,
      renovaciones_hechas: 2,
      notas: "Segunda renovación aprobada por la dirección"
    },
    {
      id: "15",
      libroId: "L015",
      usuarioId: "021",
      fechaPrestamo: "2025-03-10",
      fechaDevolucionPrevista: "2025-03-24",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      notas: "Libro reservado previamente por otro usuario"
    }
  ];
  

  // Función de filtrado por búsqueda
  const filteredPrestamos = useCallback(() => {
    return prestamosVencidosCompletos.filter(prestamo => {
      if (searchTerm === "") return true;
      
      const libroInfo = getLibroInfo(prestamo.libroId);
      const usuarioInfo = getUsuarioInfo(prestamo.usuarioId);
      
      return libroInfo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
             libroInfo.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
             usuarioInfo.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, prestamosVencidosCompletos]);

  // Obtener los préstamos filtrados
  const prestamosVencidos = filteredPrestamos();

  // Obtener el total de préstamos vencidos
  const totalVencidos = prestamosVencidos.length;

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">Préstamos Vencidos</h1>
            <Badge color="danger" size="lg">{prestamosVencidos.length}</Badge>
          </div>
          <p className="text-lg text-default-500">
            Libros con fecha de devolución vencida que requieren atención inmediata
          </p>
        </div>

        <Card shadow="md" radius="lg" className="w-full">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Libros vencidos</h2>
            <div className="w-full sm:w-1/2">
              <Input
                placeholder="Buscar por título, autor o usuario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Tabla de préstamos vencidos">
              <TableHeader>
                <TableColumn>LIBRO</TableColumn>
                <TableColumn>AUTOR</TableColumn>
                <TableColumn>USUARIO</TableColumn>
                <TableColumn>FECHA DEVOLUCIÓN</TableColumn>
                <TableColumn>DÍAS VENCIDO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay préstamos vencidos">
                {prestamosVencidos.map((prestamo) => {
                  const libroInfo = getLibroInfo(prestamo.libroId);
                  const usuarioInfo = getUsuarioInfo(prestamo.usuarioId);
                  
                  return (
                    <TableRow key={prestamo.id} className="text-danger">
                      <TableCell>{libroInfo.titulo}</TableCell>
                      <TableCell>{libroInfo.autor}</TableCell>
                      <TableCell>{usuarioInfo}</TableCell>
                      <TableCell>{prestamo.fechaDevolucionPrevista}</TableCell>
                      <TableCell>
                        <Chip 
                          color="danger" 
                          variant="flat"
                          size="sm"
                          radius="full"
                        >
                          {prestamo.diasRetraso || 0} días
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <DropdownActionsLoans prestamo={prestamo}></DropdownActionsLoans>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardBody>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="text-default-500">Total préstamos vencidos: <span className="font-bold text-danger">{totalVencidos}</span></p>
            </div>
          </CardFooter>
        </Card>

        <Card shadow="md" radius="lg" className="w-full bg-danger-50 dark:bg-danger-900/20">
          <CardBody>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="text-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-danger">Recordatorio para el bibliotecario</h3>
                <p className="text-danger-600 dark:text-danger-400">
                  Para préstamos con más de 15 días de retraso, se debe notificar al departamento académico correspondiente.
                  Los usuarios con multas pendientes no podrán realizar nuevos préstamos hasta regularizar su situación.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}