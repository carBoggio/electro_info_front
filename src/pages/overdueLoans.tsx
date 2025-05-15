import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Input } from "@heroui/input";
import DefaultLayout from "@/layouts/default";
import DropdownActionsLoans from "@/components/dropDownActionsLoans";
import { Prestamo } from "@/types";
import { getOverdueLoans } from "@/actions/getOverdueLoans";

export default function OverdueLoansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [prestamosVencidos, setPrestamosVencidos] = useState<Prestamo[]>([]);

  useEffect(() => {
    getOverdueLoans().then(setPrestamosVencidos);
  }, []);

  const filteredPrestamos = useCallback(() => {
    return prestamosVencidos.filter(prestamo => {
      if (searchTerm === "") return true;
      return (
        prestamo.LibroNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof prestamo.autor === "string" && prestamo.autor.toLowerCase().includes(searchTerm.toLowerCase())) ||
        prestamo.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, prestamosVencidos]);

  const prestamosFiltrados = filteredPrestamos();
  const totalVencidos = prestamosFiltrados.length;

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">Préstamos Vencidos</h1>
            <Badge color="danger" size="lg">{totalVencidos}</Badge>
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
                {prestamosFiltrados.map((prestamo) => (
                  <TableRow key={prestamo.id} className="text-danger">
                    <TableCell>{prestamo.LibroNombre}</TableCell>
                    <TableCell>{prestamo.autor}</TableCell>
                    <TableCell>{prestamo.usuarioNombre}</TableCell>
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
                      <DropdownActionsLoans {...prestamo} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="text-default-500">
                Total préstamos vencidos: <span className="font-bold text-danger">{totalVencidos}</span>
              </p>
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