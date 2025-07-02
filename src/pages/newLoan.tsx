import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect } from "react";
import { Libro } from "@/types";
import { makeLoan } from "@/actions/MakeLoan";
import { getBookByCode } from "@/actions/getBookByCode";
import BookSelectionModal from "@/components/BookSelectionModal";
import InterestedUsersModal from "@/components/InterestedUsersModal";

export default function NewLoanPage() {
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar la selección de libro
  const handleBookSelection = async (bookId: string) => {
    try {
      const bookResponse = await getBookByCode(bookId);
      if (bookResponse.success && bookResponse.libro) {
        setSelectedBook(bookResponse.libro);
        setError(null);
      } else {
        setError("Error al obtener información del libro");
      }
    } catch (err) {
      setError("Error al obtener información del libro");
    }
  };

  // Función para manejar la selección de usuario
  const handleUserSelection = (userId: string) => {
    setSelectedUserId(userId);
    // Aquí podrías hacer una llamada para obtener el nombre del usuario
    // Por ahora usamos el ID como nombre
    setSelectedUserName(`Usuario ${userId}`);
    setError(null);
  };

  // Función para confirmar el préstamo
  const handleConfirmPrestamo = async () => {
    if (!selectedBook || !selectedUserId) {
      setError("Por favor selecciona un libro y un usuario");
      return;
    }

    try {
      setIsConfirming(true);
      setError(null);
      setSuccessMessage(null);

      const result = await makeLoan(
        selectedUserId,
        14, // duración por defecto
        selectedBook.id
      );

      if (result.success) {
        setSuccessMessage(result.message);
        // Limpiar selecciones
        setSelectedBook(null);
        setSelectedUserId("");
        setSelectedUserName("");
      } else {
        setError(result.message || "Error al realizar el préstamo");
      }
    } catch (error) {
      console.error("Error al realizar el préstamo:", error);
      setError("Ocurrió un error al realizar el préstamo. Inténtelo nuevamente.");
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="space-y-8 py-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Nuevo Préstamo</h1>
          <p className="text-xl text-default-500">
            Selecciona un libro y un usuario para crear un nuevo préstamo
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

        {/* Tarjeta de selección de libro */}
        <Card className="w-full" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Selección de Libro</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            {selectedBook ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Información del Libro</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Título:</span> {selectedBook.titulo}</p>
                      <p><span className="font-medium">Autor:</span> {selectedBook.autor}</p>
                      <p><span className="font-medium">ID del Libro:</span> {selectedBook.id}</p>
                      <p><span className="font-medium">ISBN:</span> {selectedBook.isbn}</p>
                      <p><span className="font-medium">Disponibles:</span> {selectedBook.disponibles}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Estado</h3>
                    <Chip
                      color="success"
                      variant="flat"
                      size="lg"
                      radius="full"
                    >
                      Disponible para préstamo
                    </Chip>
                  </div>
                </div>
                <Button 
                  color="danger" 
                  variant="light" 
                  onClick={() => setSelectedBook(null)}
                >
                  Cambiar libro
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <p className="text-lg text-default-500 mb-4">No hay libro seleccionado</p>
                <Button 
                  color="primary" 
                  onClick={() => setIsBookModalOpen(true)}
                >
                  Seleccionar Libro
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tarjeta de selección de usuario */}
        <Card className="w-full" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Selección de Usuario</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            {selectedUserId ? (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Usuario Seleccionado</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">ID:</span> {selectedUserId}</p>
                    <p><span className="font-medium">Nombre:</span> {selectedUserName}</p>
                  </div>
                </div>
                <Button 
                  color="danger" 
                  variant="light" 
                  onClick={() => {
                    setSelectedUserId("");
                    setSelectedUserName("");
                  }}
                >
                  Cambiar usuario
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <p className="text-lg text-default-500 mb-4">No hay usuario seleccionado</p>
                <Button 
                  color="secondary" 
                  onClick={() => setIsUsersModalOpen(true)}
                >
                  Usuarios Interesados
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tarjeta de confirmación */}
        {selectedBook && selectedUserId && (
          <Card className="w-full" shadow="sm">
            <CardHeader className="px-6 py-4">
              <h2 className="text-2xl font-semibold">Confirmar Préstamo</h2>
            </CardHeader>
            <CardBody className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resumen del Préstamo</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Libro:</span> {selectedBook.titulo}</p>
                    <p><span className="font-medium">Usuario:</span> {selectedUserName}</p>
                    <p><span className="font-medium">Duración:</span> 14 días</p>
                    <p><span className="font-medium">Fecha de devolución prevista:</span> {
                      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()
                    }</p>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                color="danger" 
                variant="light" 
                onClick={() => {
                  setSelectedBook(null);
                  setSelectedUserId("");
                  setSelectedUserName("");
                }}
                isDisabled={isConfirming}
              >
                Cancelar
              </Button>
              <Button 
                color="primary" 
                onClick={handleConfirmPrestamo}
                isLoading={isConfirming}
                isDisabled={isConfirming}
              >
                Confirmar Préstamo
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Modales */}
        <BookSelectionModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          setBookId={handleBookSelection}
        />

        <InterestedUsersModal
          isOpen={isUsersModalOpen}
          onClose={() => setIsUsersModalOpen(false)}
          setSelectedUserId={handleUserSelection}
        />
      </div>
    </DefaultLayout>
  );
}