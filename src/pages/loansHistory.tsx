import { useState, useCallback } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useNavigate } from "react-router-dom";
import DropdownActionsLoans, { PrestamoDropdown } from "@/components/dropDownActionsLoans";
import DefaultLayout from "@/layouts/default";
import { Prestamo, PrestamoEstado } from "@/types";

// Información adicional que se obtendrá de otros endpoints
export interface InfoAdicionalPrestamo {
  libro: string;
  autor: string;
  usuario: string;
}

// Función para obtener información adicional del préstamo (simulada)
const getPrestamoInfo = (prestamo: Prestamo): InfoAdicionalPrestamo => {
  // Diccionario simulado de información de libros
  const librosInfo: Record<string, { titulo: string, autor: string }> = {
    'L001': { titulo: "Fahrenheit 451", autor: "Ray Bradbury" },
    'L002': { titulo: "El retrato de Dorian Gray", autor: "Oscar Wilde" },
    'L003': { titulo: "Cumbres Borrascosas", autor: "Emily Brontë" },
    'L004': { titulo: "El lobo estepario", autor: "Hermann Hesse" },
    'L005': { titulo: "Mujercitas", autor: "Louisa May Alcott" },
    'L006': { titulo: "Crimen y castigo", autor: "Fiódor Dostoievski" },
    'L007': { titulo: "Orgullo y prejuicio", autor: "Jane Austen" },
    'L008': { titulo: "El Alquimista", autor: "Paulo Coelho" }
  };
  
  // Diccionario simulado de información de usuarios
  const usuariosInfo: Record<string, string> = {
    '001': "Laura González",
    '002': "Eduardo Ramírez",
    '003': "Sofía Torres",
    '004': "Diego Morales",
    '005': "Ana Silva",
    '006': "Carlos Méndez",
    '007': "María Jiménez",
    '008': "Roberto Sánchez"
  };
  
  return {
    libro: librosInfo[prestamo.libroId]?.titulo || "Libro desconocido",
    autor: librosInfo[prestamo.libroId]?.autor || "Autor desconocido",
    usuario: usuariosInfo[prestamo.usuarioId] || "Usuario desconocido"
  };
};

export default function LoansHistoryPage() {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para el filtro
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const navigate = useNavigate();
  
  // Datos de ejemplo - en un caso real vendrían de una API
  const prestamosBase: Prestamo[] = [
    {
      id: "1",
      libroId: "L001",
      usuarioId: "001",
      fechaPrestamo: "2025-01-15",
      fechaDevolucionPrevista: "2025-01-29",
      fechaDevolucionReal: "2025-01-28",
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      notas: "Libro devuelto en perfectas condiciones"
    },
    {
      id: "2",
      libroId: "L002",
      usuarioId: "002",
      fechaPrestamo: "2025-02-01",
      fechaDevolucionPrevista: "2025-02-15",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      notas: "Primera vez que el usuario solicita este libro"
    },
    {
      id: "3",
      libroId: "L003",
      usuarioId: "003",
      fechaPrestamo: "2025-01-20",
      fechaDevolucionPrevista: "2025-02-03",
      estado: PrestamoEstado.VENCIDO,
      renovaciones_hechas: 0,
      diasRetraso: 10,
      notas: "Usuario contactado por email el 04/02"
    },
    {
      id: "4",
      libroId: "L004",
      usuarioId: "004",
      fechaPrestamo: "2025-01-10",
      fechaDevolucionPrevista: "2025-01-24",
      fechaDevolucionReal: "2025-01-23",
      estado: PrestamoEstado.DEVUELTO,
      renovaciones_hechas: 0,
      notas: ""
    },
    {
      id: "5",
      libroId: "L005",
      usuarioId: "005",
      fechaPrestamo: "2025-02-05",
      fechaDevolucionPrevista: "2025-02-19",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      notas: "Libro prestado para trabajo académico"
    },
    {
      id: "6",
      libroId: "L006",
      usuarioId: "006",
      fechaPrestamo: "2025-01-05",
      fechaDevolucionPrevista: "2025-01-19",
      estado: PrestamoEstado.VENCIDO,
      renovaciones_hechas: 0,
      diasRetraso: 25,
      notas: "Usuario reportó pérdida el 30/01"
    },
    {
      id: "7",
      libroId: "L007",
      usuarioId: "007",
      fechaPrestamo: "2025-01-25",
      fechaDevolucionPrevista: "2025-02-08",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 1,
      notas: "Renovación solicitada por teléfono"
    },
    {
      id: "8",
      libroId: "L008",
      usuarioId: "008",
      fechaPrestamo: "2025-02-10",
      fechaDevolucionPrevista: "2025-02-24",
      estado: PrestamoEstado.ACTIVO,
      renovaciones_hechas: 0,
      notas: ""
    }
  ];
  
  // Enriquecer los préstamos con información adicional y adaptarlos para el dropdown
  const historialPrestamosCompleto = prestamosBase.map(prestamo => {
    const info = getPrestamoInfo(prestamo);
    return {
      ...prestamo,
      ...info,
      // Adaptar para el dropdown
      usuario: info.usuario // Aseguramos que usuario esté disponible para el dropdown
    };
  });

  // Función de filtrado
  const filteredPrestamos = useCallback(() => {
    return historialPrestamosCompleto.filter(prestamo => {
      // Filtro por estado
      const estadoMatch = estadoFilter === "todos" || 
                        prestamo.estado.toLowerCase() === estadoFilter.toLowerCase();
      
      // Filtro por búsqueda
      const searchMatch = 
        searchTerm === "" || 
        prestamo.libro.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prestamo.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestamo.usuario.toLowerCase().includes(searchTerm.toLowerCase());
      
      return estadoMatch && searchMatch;
    });
  }, [searchTerm, estadoFilter, historialPrestamosCompleto]);

  // Obtener los préstamos filtrados
  const historialPrestamos = filteredPrestamos();

  // Handlers para las acciones del dropdown
  const handleDevolver = (prestamoId: string | number) => {
    alert(`Devolución del préstamo #${prestamoId} registrada con éxito`);
  };

  const handleRenovar = (prestamoId: string | number) => {
    alert(`Préstamo #${prestamoId} renovado con éxito`);
  };

  const handleVerDetalles = (prestamoId: string | number) => {
    navigate(`/detalles-prestamo/${prestamoId}`);
  };

  const handleVerPerfil = (usuarioId: string) => {
    navigate(`/perfil-usuario/${usuarioId}`);
  };

  const handleVerHistorial = (usuarioId: string) => {
    navigate(`/historial-usuario/${usuarioId}`);
  };

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Historial de Préstamos</h1>
          <p className="text-lg text-default-500">
            Consulta y gestiona el historial de préstamos de la biblioteca
          </p>
        </div>

        <Card shadow="md" radius="lg" className="w-full">
          <CardHeader className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Préstamos anteriores</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar por título, autor o usuario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-1/2"
              />
              
              <Select 
                label="Filtrar por estado" 
                selectedKeys={[estadoFilter]}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full sm:w-1/4"
              >
                <SelectItem key="todos" value="todos">Todos</SelectItem>
                <SelectItem key="activo" value={PrestamoEstado.ACTIVO}>Activo</SelectItem>
                <SelectItem key="vencido" value={PrestamoEstado.VENCIDO}>Vencido</SelectItem>
                <SelectItem key="devuelto" value={PrestamoEstado.DEVUELTO}>Devuelto</SelectItem>
              </Select>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Tabla de historial de préstamos">
              <TableHeader>
                <TableColumn>LIBRO</TableColumn>
                <TableColumn>AUTOR</TableColumn>
                <TableColumn>USUARIO</TableColumn>
                <TableColumn>FECHA PRÉSTAMO</TableColumn>
                <TableColumn>FECHA DEVOLUCIÓN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No se encontraron préstamos">
                {historialPrestamos.map((prestamo) => (
                  <TableRow key={prestamo.id}>
                    <TableCell>{prestamo.libro}</TableCell>
                    <TableCell>{prestamo.autor}</TableCell>
                    <TableCell>{prestamo.usuario}</TableCell>
                    <TableCell>{prestamo.fechaPrestamo}</TableCell>
                    <TableCell>{prestamo.fechaDevolucionPrevista}</TableCell>
                    <TableCell>
                      <Chip 
                        color={
                          prestamo.estado === PrestamoEstado.DEVUELTO ? "success" :
                          prestamo.estado === PrestamoEstado.VENCIDO ? "danger" :
                          "primary"
                        }
                        variant="flat"
                        size="sm"
                        radius="full"
                      >
                        {prestamo.estado}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <DropdownActionsLoans 
                        prestamo={prestamo}
                        onDevolver={handleDevolver}
                        onRenovar={handleRenovar}
                        onVerDetalles={handleVerDetalles}
                        onVerPerfil={handleVerPerfil}
                        onVerHistorial={handleVerHistorial}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
          <CardFooter className="flex justify-between items-center">
            <p className="text-small text-default-500">Total de préstamos: {historialPrestamos.length}</p>
            <Pagination total={1} initialPage={1} />
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}