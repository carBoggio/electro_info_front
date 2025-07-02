import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from "react";
import { Prestamo, PrestamoEstado } from "@/types";
import { getActiveLoans } from "@/actions/getActiveLoans";
import { returnBook } from "@/actions/returnBook";
import { getBookByCode } from "@/actions/getBookByCode";

export default function ReturnLoanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReturning, setIsReturning] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal
  const [bookIdInput, setBookIdInput] = useState("");
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrestamos = async () => {
      try {
        setIsLoading(true);
        const activos = await getActiveLoans();
        setPrestamos(activos);
      } catch (err) {
        setError("Error al cargar los préstamos activos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrestamos();
  }, []);

  const handleSelectBook = async () => {
    if (!bookIdInput.trim()) {
      setSearchError("Por favor ingrese un ID de libro");
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      
      // Buscar el libro en la BD
      const bookResponse = await getBookByCode(bookIdInput.trim());
      
      if (!bookResponse.success || !bookResponse.libro) {
        setSearchError("Libro no encontrado en la base de datos");
        return;
      }

      // Buscar si el libro está prestado
      const prestamoActivo = prestamos.find(p => p.libroId === bookIdInput.trim());
      
      if (!prestamoActivo) {
        setSearchError("Este libro no tiene un préstamo activo");
        return;
      }

      setSelectedPrestamo(prestamoActivo);
      setIsModalOpen(false);
      setBookIdInput("");
      
    } catch (err) {
      setSearchError("Error al buscar el libro. Por favor, intente nuevamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleReturn = async () => {
    if (!selectedPrestamo) return;
    
    try {
      setIsReturning(true);
      setError(null);
      setSuccessMessage(null);
      const result = await returnBook(selectedPrestamo.libroId);
      
      if (result.success) {
        setSuccessMessage(result.message);
        // Remover el préstamo de la lista
        setPrestamos(prev => prev.filter(p => p.id !== selectedPrestamo.id));
        setSelectedPrestamo(null);
      } else {
        setError(result.message || "No se pudo devolver el préstamo");
      }
    } catch (err) {
      setError("Error al devolver el préstamo. Por favor, intente nuevamente.");
    } finally {
      setIsReturning(false);
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

  return (
    <DefaultLayout>
      <div className="space-y-8 py-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Devolver Libros</h1>
          <p className="text-xl text-default-500">
            Selecciona un libro con préstamo activo para devolverlo
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

        {/* Botón para seleccionar libro */}
        <div className="flex justify-end">
          <Button
            color="primary"
            variant="flat"
            onClick={() => setIsModalOpen(true)}
            className="px-6"
          >
            Seleccionar Libro
          </Button>
        </div>

        {/* Lista de préstamos activos */}
        <Card className="w-full min-h-[300px]" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Libros con Préstamos Activos</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ID Libro</th>
                    <th className="px-4 py-2 border">Título</th>
                    <th className="px-4 py-2 border">Autor</th>
                    <th className="px-4 py-2 border">Usuario</th>
                    <th className="px-4 py-2 border">Estado</th>
                    <th className="px-4 py-2 border">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-default-500">Cargando préstamos activos...</td>
                    </tr>
                  ) : prestamos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-default-500">No hay préstamos activos.</td>
                    </tr>
                  ) : (
                    prestamos.map((prestamo) => (
                      <tr key={prestamo.id} className={selectedPrestamo?.id === prestamo.id ? "bg-primary-50" : ""}>
                        <td className="px-4 py-2 border">{prestamo.libroId}</td>
                        <td className="px-4 py-2 border">{prestamo.LibroNombre}</td>
                        <td className="px-4 py-2 border">{prestamo.autor}</td>
                        <td className="px-4 py-2 border">{prestamo.usuarioNombre}</td>
                        <td className="px-4 py-2 border">
                          <Chip
                            color={getChipColor(prestamo.estado)}
                            variant="flat"
                            size="sm"
                            radius="full"
                          >
                            {prestamo.estado}
                          </Chip>
                        </td>
                        <td className="px-4 py-2 border">
                          <Button
                            color="success"
                            size="sm"
                            onClick={() => setSelectedPrestamo(prestamo)}
                            variant={selectedPrestamo?.id === prestamo.id ? "solid" : "flat"}
                          >
                            Seleccionar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Detalles del préstamo seleccionado */}
        {selectedPrestamo && (
          <Card className="w-full" shadow="sm">
            <CardHeader className="px-6 py-4">
              <h2 className="text-2xl font-semibold">Préstamo Seleccionado</h2>
            </CardHeader>
            <CardBody className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Información del Libro</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Título:</span> {selectedPrestamo.LibroNombre}</p>
                      <p><span className="font-medium">Autor:</span> {selectedPrestamo.autor}</p>
                      <p><span className="font-medium">ID del Libro:</span> {selectedPrestamo.libroId}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Información del Usuario</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Nombre:</span> {selectedPrestamo.usuarioNombre}</p>
                      <p><span className="font-medium">ID del Usuario:</span> {selectedPrestamo.usuarioId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Detalles del Préstamo</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Fecha de Préstamo:</span> {selectedPrestamo.fechaPrestamo}</p>
                      <p><span className="font-medium">Fecha de Devolución Prevista:</span> {selectedPrestamo.fechaDevolucionPrevista}</p>
                      <p><span className="font-medium">Estado:</span> 
                        <Chip
                          color={getChipColor(selectedPrestamo.estado)}
                          variant="flat"
                          size="sm"
                          radius="full"
                          className="ml-2"
                        >
                          {selectedPrestamo.estado}
                        </Chip>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    {selectedPrestamo.estado !== PrestamoEstado.DEVUELTO && (
                      <Button
                        color="success"
                        variant="flat"
                        onClick={handleReturn}
                        isLoading={isReturning}
                        isDisabled={isReturning}
                      >
                        Confirmar Devolución
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Modal para seleccionar libro */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Seleccionar Libro por ID</h3>
                <Button
                  color="danger"
                  variant="light"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <p className="text-default-500">
                  Ingresa el ID del libro que deseas devolver
                </p>
                <Input
                  label="ID del Libro"
                  placeholder="Ej: 12345"
                  value={bookIdInput}
                  onChange={(e) => setBookIdInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSelectBook()}
                />
                {searchError && (
                  <p className="text-danger text-sm">{searchError}</p>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  color="danger" 
                  variant="light" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  color="primary" 
                  onClick={handleSelectBook}
                  isLoading={isSearching}
                  isDisabled={isSearching}
                >
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
} 