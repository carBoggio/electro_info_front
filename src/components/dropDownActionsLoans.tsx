import { useState, useCallback } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";

// Enums y definición de interfaces
export enum PrestamoEstado {
  ACTIVO = "ACTIVO",
  DEVUELTO = "DEVUELTO",
  RETRASADO = "RETRASADO",
  PERDIDO = "PERDIDO",
  RENOVADO = "RENOVADO"
}

// Modelo de Prestamo
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

// Información adicional que se obtendrá de otros endpoints
interface InfoAdicionalPrestamo {
  libro: string;
  autor: string;
  usuario: string;
}

// Componente para las acciones de cada préstamo
interface DropdownActionsLoansProps {
  prestamo: Prestamo & InfoAdicionalPrestamo;
  onDevolver?: (prestamoId: string) => void;
  onRenovar?: (prestamoId: string) => void;
  onVerDetalles: (prestamoId: string) => void;
  onVerPerfil: (usuarioId: string) => void;
  onVerHistorial: (usuarioId: string) => void;
}

const DropdownActionsLoans = ({ 
  prestamo, 
  onDevolver, 
  onRenovar, 
  onVerDetalles,
  onVerPerfil,
  onVerHistorial
}: DropdownActionsLoansProps) => {
  // Aquí iría la implementación del dropdown de acciones
  // Por simplicidad, utilizo botones básicos en este ejemplo
  return (
    <div className="flex gap-2">
      <button 
        className="text-primary text-sm hover:underline" 
        onClick={() => onVerDetalles(prestamo.id)}
      >
        Ver detalles
      </button>
      
      {onDevolver && prestamo.estado === PrestamoEstado.ACTIVO && (
        <button 
          className="text-success text-sm hover:underline"
          onClick={() => onDevolver(prestamo.id)}
        >
          Devolver
        </button>
      )}
      
      {onRenovar && prestamo.estado === PrestamoEstado.ACTIVO && (
        <button 
          className="text-warning text-sm hover:underline"
          onClick={() => onRenovar(prestamo.id)}
        >
          Renovar
        </button>
      )}
      
      <button 
        className="text-secondary text-sm hover:underline" 
        onClick={() => onVerPerfil(prestamo.usuarioId)}
      >
        Ver perfil
      </button>
      
      <button 
        className="text-info text-sm hover:underline" 
        onClick={() => onVerHistorial(prestamo.usuarioId)}
      >
        Historial
      </button>
    </div>
  );
};

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
      estado: PrestamoEstado.RETRASADO,
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
      estado: PrestamoEstado.PERDIDO,
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

      estado: PrestamoEstado.RENOVADO,
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
  
  // Enriquecer los préstamos con información adicional
  const historialPrestamosCompleto = prestamosBase.map(prestamo => ({
    ...prestamo,
    ...getPrestamoInfo(prestamo)
  }));

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
  const handleDevolver = (prestamoId: string) => {
    alert(`Devolución del préstamo #${prestamoId} registrada con éxito`);
  };

  const handleRenovar = (prestamoId: string) => {
    alert(`Préstamo #${prestamoId} renovado con éxito`);
  };

  const handleVerDetalles = (prestamoId: string) => {
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
                <SelectItem key="devuelto" value={PrestamoEstado.DEVUELTO}>Devuelto</SelectItem>
                <SelectItem key="retrasado" value={PrestamoEstado.RETRASADO}>Retrasado</SelectItem>
                <SelectItem key="perdido" value={PrestamoEstado.PERDIDO}>Perdido</SelectItem>
                <SelectItem key="renovado" value={PrestamoEstado.RENOVADO}>Renovado</SelectItem>
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
                          prestamo.estado === PrestamoEstado.RETRASADO || prestamo.estado === PrestamoEstado.PERDIDO ? "danger" :
                          prestamo.estado === PrestamoEstado.RENOVADO ? "warning" : "primary"
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