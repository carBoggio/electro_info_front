import { useState, useCallback } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useNavigate } from "react-router-dom";
import DropdownActionsLoans from "@/components/dropDownActionsLoans";
import DefaultLayout from "@/layouts/default";
import { Prestamo, PrestamoEstado, Libro, LibroUbicacion } from "@/types";
import { Selection } from "@react-types/shared";

// Datos de ejemplo de libros como lista
const LIBROS_LISTA: Libro[] = [
  { 
    id: 'L001',
    titulo: "Fahrenheit 451", 
    autor: "Ray Bradbury",
    disponibles: 2,
    ubicacion: LibroUbicacion.GRADO
  },
  { 
    id: 'L002',
    titulo: "El retrato de Dorian Gray", 
    autor: "Oscar Wilde",
    disponibles: 1,
    ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS
  },
  { 
    id: 'L003',
    titulo: "Cumbres Borrascosas", 
    autor: "Emily Brontë",
    disponibles: 3,
    ubicacion: LibroUbicacion.GRADO
  },
  { 
    id: 'L004',
    titulo: "El lobo estepario", 
    autor: "Hermann Hesse",
    disponibles: 0,
    ubicacion: LibroUbicacion.GRADO
  },
  { 
    id: 'L005',
    titulo: "Mujercitas", 
    autor: "Louisa May Alcott",
    disponibles: 2,
    ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS
  },
  { 
    id: 'L006',
    titulo: "Crimen y castigo", 
    autor: "Fiódor Dostoievski",
    disponibles: 1,
    ubicacion: LibroUbicacion.GRADO
  },
  { 
    id: 'L007',
    titulo: "Orgullo y prejuicio", 
    autor: "Jane Austen",
    disponibles: 4,
    ubicacion: LibroUbicacion.GRADO
  },
  { 
    id: 'L008',
    titulo: "El Alquimista", 
    autor: "Paulo Coelho",
    disponibles: 2,
    ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS
  }
];

// Mapeo simple de IDs a nombres de usuarios
const USUARIOS: Record<string, string> = {
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
const PRESTAMOS_BASE: Prestamo[] = [
  {
    id: "1", libroId: "L001", usuarioId: "001",
    fechaPrestamo: "2025-01-15", fechaDevolucionPrevista: "2025-01-29", 
    fechaDevolucionReal: "2025-01-28", estado: PrestamoEstado.DEVUELTO,
    renovaciones_hechas: 0, notas: "Libro devuelto en perfectas condiciones"
  },
  {
    id: "2", libroId: "L002", usuarioId: "002",
    fechaPrestamo: "2025-02-01", fechaDevolucionPrevista: "2025-02-15", 
    estado: PrestamoEstado.ACTIVO, renovaciones_hechas: 0,
    notas: "Primera vez que el usuario solicita este libro"
  },
  {
    id: "3", libroId: "L003", usuarioId: "003",
    fechaPrestamo: "2025-01-20", fechaDevolucionPrevista: "2025-02-03", 
    estado: PrestamoEstado.VENCIDO, renovaciones_hechas: 0, diasRetraso: 10,
    notas: "Usuario contactado por email el 04/02"
  }
];

// Opciones para el filtro de estado
const estadoOptions = [
  { key: "todos", label: "Todos" },
  { key: "activo", label: "Activo" },
  { key: "vencido", label: "Vencido" },
  { key: "devuelto", label: "Devuelto" }
];

// Tipo simple para préstamos con información adicional
type PrestamoConInfo = Prestamo & {
  libro: string;
  autor: string;
  usuario: string;
};

export default function LoansHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<Selection>(new Set(["todos"]));
  const navigate = useNavigate();
  
  // Crear un mapa de libros por ID para facilitar la búsqueda
  const librosMap = LIBROS_LISTA.reduce((map, libro) => {
    map[libro.id] = libro;
    return map;
  }, {} as Record<string, Libro>);
  
  // Enriquecer los préstamos con información adicional
  const historialPrestamosCompleto: PrestamoConInfo[] = PRESTAMOS_BASE.map(prestamo => {
    const libro = librosMap[prestamo.libroId];
    
    return {
      ...prestamo,
      libro: libro?.titulo || "Libro desconocido",
      autor: libro?.autor || "Autor desconocido",
      usuario: USUARIOS[prestamo.usuarioId] || "Usuario desconocido"
    };
  });

  // Función de filtrado simplificada
  const historialPrestamos = useCallback(() => {
    // Extraer el valor seleccionado del Set
    let estadoSeleccionado = "todos";
    
    if (estadoFilter === "all") {
      estadoSeleccionado = "todos";
    } else if (estadoFilter instanceof Set) {
      estadoSeleccionado = Array.from(estadoFilter)[0] as string || "todos";
    }
    
    return historialPrestamosCompleto.filter(prestamo => {
      const estadoMatch = estadoSeleccionado === "todos" || 
                          prestamo.estado.toLowerCase() === estadoSeleccionado.toLowerCase();
      
      const searchMatch = 
        searchTerm === "" || 
        prestamo.libro.toLowerCase().includes(searchTerm.toLowerCase()) || 
        prestamo.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prestamo.usuario.toLowerCase().includes(searchTerm.toLowerCase());
      
      return estadoMatch && searchMatch;
    });
  }, [searchTerm, estadoFilter])();

  // Funciones de manejo de acciones
  const handleActions = {
    devolver: (id: string | number) => alert(`Devolución del préstamo #${id} registrada con éxito`),
    renovar: (id: string | number) => alert(`Préstamo #${id} renovado con éxito`),
    verDetalles: (id: string | number) => navigate(`/detalles-prestamo/${id}`),
    verPerfil: (id: string) => navigate(`/perfil-usuario/${id}`),
    verHistorial: (id: string) => navigate(`/historial-usuario/${id}`)
  };

  // Función para determinar el color del chip según el estado
  const getChipColor = (estado: PrestamoEstado) => {
    switch(estado) {
      case PrestamoEstado.DEVUELTO: return "success";
      case PrestamoEstado.VENCIDO: return "danger";
      default: return "primary";
    }
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
                labelPlacement="outside" 
                placeholder="Seleccionar estado"
                selectedKeys={estadoFilter}
                onSelectionChange={(keys) => setEstadoFilter(keys)}
                className="w-full sm:w-1/4"
              >
                {estadoOptions.map((option) => (
                  <SelectItem key={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
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
                        color={getChipColor(prestamo.estado)}
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
                        onDevolver={handleActions.devolver}
                        onRenovar={handleActions.renovar}
                        onVerDetalles={handleActions.verDetalles}
                        onVerPerfil={handleActions.verPerfil}
                        onVerHistorial={handleActions.verHistorial}
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