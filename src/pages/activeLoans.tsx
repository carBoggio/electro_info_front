import { useState, useEffect, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { useNavigate } from "react-router-dom";
import DropdownActionsLoans from "@/components/dropDownActionsLoans";
import DefaultLayout from "@/layouts/default";
import { Prestamo, PrestamoEstado } from "@/types";
import { getActiveLoans } from "@/actions/getActiveLoans";


export default function ActiveLoansPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [prestamosCompletos, setPrestamosCompletos] = useState<Prestamo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getActiveLoans().then(setPrestamosCompletos);
  }, []);

  const filteredPrestamos = useCallback(() => {
    return prestamosCompletos.filter(prestamo => 
      searchTerm === "" || 
      prestamo.libroId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prestamo.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, prestamosCompletos]);

  const prestamos = filteredPrestamos();

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Préstamos Activos</h1>
          <p className="text-lg text-default-500">
            Gestiona los préstamos activos de la biblioteca
          </p>
        </div>

        <Card shadow="md" radius="lg" className="w-full">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Libros prestados actualmente</h2>
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
            <Table aria-label="Tabla de préstamos activos">
              <TableHeader>
                <TableColumn>LIBRO</TableColumn>
                <TableColumn>AUTOR</TableColumn>
                <TableColumn>USUARIO</TableColumn>
                <TableColumn>FECHA PRÉSTAMO</TableColumn>
                <TableColumn>FECHA DEVOLUCIÓN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>RENOVACIONES</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay préstamos activos">
                {prestamos.map((prestamo) => (
                  <TableRow key={prestamo.id}>
                    <TableCell>{prestamo.libroId}</TableCell>
                    <TableCell>{prestamo.autor}</TableCell>
                    <TableCell>{prestamo.usuarioNombre}</TableCell>
                    <TableCell>{prestamo.fechaPrestamo}</TableCell>
                    <TableCell>{prestamo.fechaDevolucionReal}</TableCell>
                    <TableCell>
                      <Chip 
                        color={prestamo.estado === PrestamoEstado.VENCIDO ? "warning" : "primary"}
                        variant="flat"
                        size="sm"
                        radius="full"
                      >
                        {prestamo.estado}
                      </Chip>
                    </TableCell>
                    <TableCell>{prestamo.renovaciones_hechas}/2</TableCell>
                    <TableCell>
                      <DropdownActionsLoans {...prestamo} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}