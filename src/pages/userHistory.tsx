import { useParams } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from "react";
import { Usuario, PrestamoEstado } from "@/types";
import { getUser } from "@/actions/getUser";

export default function UserHistoryPage() {
  const { userId } = useParams();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const data = await getUser(userId);
        setUsuario(data);
      } catch (err) {
        setError("Error al cargar los datos del usuario");
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const getChipColor = (estado: PrestamoEstado) => {
    switch(estado) {
      case PrestamoEstado.DEVUELTO:
        return "success";
      case PrestamoEstado.VENCIDO:
        return "danger";
      default:
        return "primary";
    }
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p>Cargando datos del usuario...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !usuario) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p className="text-danger">{error || "No se encontró el usuario"}</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="space-y-8 py-8">
        {/* Información del Usuario */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Perfil de Usuario</h1>
          <p className="text-xl text-default-500">
            Información y historial de préstamos
          </p>
        </div>

        {/* Detalles del Usuario */}
        <Card className="w-full" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Información Personal</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p><span className="font-medium">Nombre:</span> {usuario.nombre} {usuario.apellido}</p>
                <p><span className="font-medium">Email:</span> {usuario.email}</p>
                <p><span className="font-medium">Tarjeta Austral:</span> {usuario.idTarjetaAustral}</p>
                <p><span className="font-medium">Rol:</span> {usuario.rol}</p>
              </div>
              <div>
                <p><span className="font-medium">Estado:</span> {usuario.estado}</p>
                <p><span className="font-medium">Fecha de Registro:</span> {usuario.fechaRegistro}</p>
                <p><span className="font-medium">Carrera:</span> {usuario.carrera || 'N/A'}</p>
                <p><span className="font-medium">Límite de Préstamos:</span> {usuario.limitePrestamos}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Préstamos Activos */}
        <Card className="w-full" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Préstamos Activos</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <Table>
              <TableHeader>
                <TableColumn>LIBRO</TableColumn>
                <TableColumn>AUTOR</TableColumn>
                <TableColumn>FECHA PRÉSTAMO</TableColumn>
                <TableColumn>FECHA DEVOLUCIÓN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay préstamos activos">
                {(usuario.prestamosActivos || []).map((prestamo) => (
                  <TableRow key={prestamo.id}>
                    <TableCell>{prestamo.LibroNombre}</TableCell>
                    <TableCell>{prestamo.autor}</TableCell>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>

        {/* Historial de Préstamos */}
        <Card className="w-full" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Historial de Préstamos</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <Table>
              <TableHeader>
                <TableColumn>LIBRO</TableColumn>
                <TableColumn>AUTOR</TableColumn>
                <TableColumn>FECHA PRÉSTAMO</TableColumn>
                <TableColumn>FECHA DEVOLUCIÓN</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>NOTAS</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No hay historial de préstamos">
                {(usuario.historialPrestamos || []).map((prestamo) => (
                  <TableRow key={prestamo.id}>
                    <TableCell>{prestamo.LibroNombre}</TableCell>
                    <TableCell>{prestamo.autor}</TableCell>
                    <TableCell>{prestamo.fechaPrestamo}</TableCell>
                    <TableCell>{prestamo.fechaDevolucionReal || prestamo.fechaDevolucionPrevista}</TableCell>
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
                    <TableCell>{prestamo.notas || '-'}</TableCell>
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