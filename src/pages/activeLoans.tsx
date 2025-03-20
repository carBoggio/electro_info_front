import { useState, useCallback } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { useNavigate } from "react-router-dom";
import DropdownActionsLoans, { PrestamoDropdown } from "@/components/dropDownActionsLoans";
import DefaultLayout from "@/layouts/default";

// Interfaz para los datos completos de préstamo en esta página
interface PrestamoDatos extends PrestamoDropdown {
  autor: string;
  libro: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: string;
}

export default function ActiveLoansPage() {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  // Datos de ejemplo - en un caso real vendrían de una API
  const prestamosCompletos: PrestamoDatos[] = [
    { 
      id: "1", 
      libro: "Cien años de soledad", 
      autor: "Gabriel García Márquez", 
      usuario: "Ana Rodríguez", 
      usuarioId: "001", 
      fechaPrestamo: "2025-03-01", 
      fechaDevolucion: "2025-03-15", 
      estado: "En préstamo",
      renovaciones: 0
    },
    { 
      id: "2", 
      libro: "El principito", 
      autor: "Antoine de Saint-Exupéry", 
      usuario: "Carlos Gómez", 
      usuarioId: "002", 
      fechaPrestamo: "2025-03-05", 
      fechaDevolucion: "2025-03-19", 
      estado: "En préstamo",
      renovaciones: 1
    },
    { 
      id: "3", 
      libro: "Don Quijote de la Mancha", 
      autor: "Miguel de Cervantes", 
      usuario: "María Fernández", 
      usuarioId: "003", 
      fechaPrestamo: "2025-03-08", 
      fechaDevolucion: "2025-03-22", 
      estado: "Por vencer",
      renovaciones: 2
    },
  ];

  // Función de filtrado por búsqueda
  const filteredPrestamos = useCallback(() => {
    return prestamosCompletos.filter(prestamo => 
      searchTerm === "" || 
      prestamo.libro.toLowerCase().includes(searchTerm.toLowerCase()) || 
      prestamo.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestamo.usuario.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, prestamosCompletos]);

  // Obtener los préstamos filtrados
  const prestamos = filteredPrestamos();

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
                    <TableCell>{prestamo.libro}</TableCell>
                    <TableCell>{prestamo.autor}</TableCell>
                    <TableCell>{prestamo.usuario}</TableCell>
                    <TableCell>{prestamo.fechaPrestamo}</TableCell>
                    <TableCell>{prestamo.fechaDevolucion}</TableCell>
                    <TableCell>
                      <Chip 
                        color={prestamo.estado === "Por vencer" ? "warning" : "primary"}
                        variant="flat"
                        size="sm"
                        radius="full"
                      >
                        {prestamo.estado}
                      </Chip>
                    </TableCell>
                    <TableCell>{prestamo.renovaciones}/2</TableCell>
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
        </Card>
      </div>
    </DefaultLayout>
  );
}