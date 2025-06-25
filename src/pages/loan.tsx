import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from "react";
import { Prestamo, PrestamoEstado } from "@/types";
import { getLoan } from "@/actions/getPrestamo";

export default function LoanPage() {
  const { loanId } = useParams();
  const [prestamo, setPrestamo] = useState<Prestamo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrestamo = async () => {
      if (!loanId) return;
      
      try {
        setIsLoading(true);
        const data = await getLoan(loanId);
        setPrestamo(data);
      } catch (err) {
        setError("Error al cargar los datos del préstamo");
        console.error("Error fetching loan:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrestamo();
  }, [loanId]);

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
          <p>Cargando datos del préstamo...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !prestamo) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <p className="text-danger">{error || "No se encontró el préstamo"}</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="space-y-8 py-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Detalles del Préstamo</h1>
          <p className="text-xl text-default-500">
            Información completa del préstamo
          </p>
        </div>

        <Card className="w-full" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Detalles del Préstamo</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Información del Libro</h3>
                  <p><span className="font-medium">Título:</span> {prestamo.LibroNombre}</p>
                  <p><span className="font-medium">Autor:</span> {prestamo.autor}</p>
                  <p><span className="font-medium">ID:</span> {prestamo.libroId}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Información del Préstamo</h3>
                  <p><span className="font-medium">Usuario:</span> {prestamo.usuarioNombre}</p>
                  <p><span className="font-medium">Fecha de Préstamo:</span> {prestamo.fechaPrestamo}</p>
                  <p><span className="font-medium">Fecha de Devolución:</span> {prestamo.fechaDevolucionPrevista}</p>
                  {prestamo.fechaDevolucionReal && (
                    <p><span className="font-medium">Fecha de Devolución Real:</span> {prestamo.fechaDevolucionReal}</p>
                  )}
                  <p>
                    <span className="font-medium">Estado:</span>{" "}
                    <Chip
                      color={getChipColor(prestamo.estado)}
                      variant="flat"
                      size="sm"
                      radius="full"
                    >
                      {prestamo.estado}
                    </Chip>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {prestamo.notas && (
                  <p className="text-sm text-default-500">
                    <span className="font-medium">Notas:</span> {prestamo.notas}
                  </p>
                )}
                
                <div className="flex justify-end gap-4">
                  {prestamo.estado !== PrestamoEstado.DEVUELTO && (
                    <>
                      <Button
                        as={Link}
                        href={`/prestamos/${prestamo.id}/devolver`}
                        color="success"
                        variant="flat"
                      >
                        Devolver Préstamo
                      </Button>
                      <Button
                        as={Link}
                        href={`/prestamos/${prestamo.id}/renovar`}
                        color="primary"
                        variant="flat"
                      >
                        Renovar Préstamo
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}