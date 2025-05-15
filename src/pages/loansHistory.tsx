import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useNavigate } from "react-router-dom";
import DropdownActionsLoans from "@/components/dropDownActionsLoans";
import DefaultLayout from "@/layouts/default";
import { Prestamo, PrestamoEstado } from "@/types";
import { getAllLoans } from "@/actions/getAllLoans";

// Opciones para el filtro de estado
const estadoOptions = [
  { key: "todos", label: "Todos" },
  { key: "activo", label: "Activo" },
  { key: "vencido", label: "Vencido" },
  { key: "devuelto", label: "Devuelto" }
];

export default function LoansHistoryPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [filteredPrestamos, setFilteredPrestamos] = useState<Prestamo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const navigate = useNavigate();

  // Cargar préstamos desde la API
  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        setIsLoading(true);
        const data = await getAllLoans();
        setPrestamos(data);
      } catch (error) {
        console.error("Error al cargar préstamos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrestamos();
  }, []);

  // Filtrar préstamos cuando cambian los filtros
  useEffect(() => {
    if (prestamos.length > 0) {
      const filtered = prestamos.filter(prestamo => {
        const estadoMatch = estadoFilter === "todos" || 
                            prestamo.estado.toLowerCase() === estadoFilter.toLowerCase();
        
        const searchMatch = 
          searchTerm === "" || 
          (prestamo.usuarioNombre && prestamo.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return estadoMatch && searchMatch;
      });
      
      setFilteredPrestamos(filtered);
    }
  }, [searchTerm, estadoFilter, prestamos]);



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
            
            
              <Input
                placeholder="Buscar por nombre de usuario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-2/3"
              />
              
              <Select 
                placeholder="Todos"
                aria-label="Filtrar por estado"
                selectedKeys={[estadoFilter]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setEstadoFilter(selected || "todos");
                }}
                className="w-full sm:w-1/3"
              >
                {estadoOptions.map((option) => (
                  <SelectItem key={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
         
          </CardHeader>
          
          <CardBody>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <p>Cargando préstamos...</p>
              </div>
            ) : (
              <Table aria-label="Tabla de historial de préstamos">
                <TableHeader>
                  <TableColumn>ID PRÉSTAMO</TableColumn>
                  <TableColumn>USUARIO</TableColumn>
                  <TableColumn>FECHA PRÉSTAMO</TableColumn>
                  <TableColumn>DEVOLUCIÓN PREVISTA</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No se encontraron préstamos">
                  {filteredPrestamos.map((prestamo) => (
                    <TableRow key={prestamo.id}>
                      <TableCell>{prestamo.id}</TableCell>
                      <TableCell>{prestamo.usuarioNombre || prestamo.usuarioId}</TableCell>
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
                        <DropdownActionsLoans {...prestamo} />        
                       
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
          
          <CardFooter className="flex justify-between items-center">
            <p className="text-small text-default-500">
              Total de préstamos: {filteredPrestamos.length}
            </p>
            <Pagination total={1} initialPage={1} />
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}