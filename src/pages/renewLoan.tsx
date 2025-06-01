import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from "react";
import { Prestamo, PrestamoEstado } from "@/types";
import { getLoan } from "@/actions/getPrestamo";
import { renewLoan } from "@/actions/renewLoan";

export default function RenewLoanPage() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const [prestamo, setPrestamo] = useState<Prestamo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRenewing, setIsRenewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleRenewal = async () => {
    if (!prestamo || !loanId) return;
    
    try {
      setIsRenewing(true);
      setError(null);
      const result = await renewLoan(loanId);
      
      if (result.success) {
        setSuccessMessage(result.message);
        if (result.prestamo) {
          setPrestamo(result.prestamo);
        }
        // Esperar 2 segundos y redirigir a préstamos activos
        setTimeout(() => {
          navigate('/prestamos-activos');
        }, 2000);
      } else {
        throw new Error("No se pudo renovar el préstamo");
      }
    } catch (err) {
      console.error("Error al renovar el préstamo:", err);
      setError("Error al renovar el préstamo. Por favor, intente nuevamente.");
    } finally {
      setIsRenewing(false);
    }
  };

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
          <h1 className="text-4xl font-bold">Renovar Préstamo</h1>
          <p className="text-xl text-default-500">
            Renueva el período de préstamo del libro
          </p>
        </div>

        {successMessage && (
          <div className="bg-success-50 border border-success-200 text-success rounded-lg p-4">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-danger-50 border border-danger-200 text-danger rounded-lg p-4">
            {error}
          </div>
        )}

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
                  <p><span className="font-medium">Renovaciones realizadas:</span> {prestamo.renovaciones_hechas}/2</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                {prestamo.notas && (
                  <p className="text-sm text-default-500">
                    <span className="font-medium">Notas:</span> {prestamo.notas}
                  </p>
                )}
                
                <div className="flex justify-end gap-4">
                  <Button
                    color="primary"
                    onClick={handleRenewal}
                    isDisabled={prestamo.renovaciones_hechas >= 2 || isRenewing}
                    isLoading={isRenewing}
                  >
                    {prestamo.renovaciones_hechas >= 2 
                      ? "Máximo de renovaciones alcanzado" 
                      : isRenewing 
                        ? "Renovando..." 
                        : "Confirmar Renovación"
                    }
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
} 