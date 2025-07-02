import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { getBookByCode } from "@/actions/getBookByCode";
import { getActiveLoans } from "@/actions/getActiveLoans";

interface BookSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  setBookId: (bookId: string) => void;
}

export default function BookSelectionModal({ isOpen, onClose, setBookId }: BookSelectionModalProps) {
  const [bookIdInput, setBookIdInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!bookIdInput.trim()) {
      setSearchError("Por favor ingrese un ID de libro");
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      setSearchSuccess(null);
      
      // Primera consulta: verificar si el libro existe
      const bookResponse = await getBookByCode(bookIdInput.trim());
      
      if (!bookResponse.success || !bookResponse.libro) {
        setSearchError("Libro no encontrado en la base de datos");
        return;
      }

      // Segunda consulta: verificar si no tiene préstamos activos
      const activeLoans = await getActiveLoans();
      const hasActiveLoan = activeLoans.some(p => p.libroId === bookIdInput.trim());
      
      if (hasActiveLoan) {
        setSearchError("Este libro ya tiene un préstamo activo");
        return;
      }

      // Si pasa ambas validaciones, seleccionar el libro
      setSearchSuccess(`Libro "${bookResponse.libro.titulo}" disponible para préstamo`);
      setBookId(bookIdInput.trim());
      onClose();
      setBookIdInput("");
      
    } catch (err) {
      setSearchError("Error al buscar el libro. Por favor, intente nuevamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClose = () => {
    setBookIdInput("");
    setSearchError(null);
    setSearchSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Seleccionar Libro por ID</h3>
          <Button
            color="danger"
            variant="light"
            size="sm"
            onClick={handleClose}
          >
            ✕
          </Button>
        </div>
        <div className="space-y-4">
          <p className="text-default-500">
            Ingresa el ID del libro que deseas prestar
          </p>
          <Input
            label="ID del Libro"
            placeholder="Ej: 12345"
            value={bookIdInput}
            onChange={(e) => setBookIdInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchError && (
            <p className="text-danger text-sm">{searchError}</p>
          )}
          {searchSuccess && (
            <p className="text-success text-sm">{searchSuccess}</p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            color="danger" 
            variant="light" 
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button 
            color="primary" 
            onClick={handleSearch}
            isLoading={isSearching}
            isDisabled={isSearching}
          >
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
} 