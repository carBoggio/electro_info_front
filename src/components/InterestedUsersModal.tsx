import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { getInterestedUsers } from "@/actions/getInterestedUsers";

interface Request {
  id: number;
  borrower_id: string;
  devolution_date: string;
  borrower_name: string;
}

interface InterestedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  setSelectedUserId: (userId: string) => void;
}

export default function InterestedUsersModal({ isOpen, onClose, setSelectedUserId }: InterestedUsersModalProps) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getInterestedUsers();
      
      if (response.success && response.data) {
        setRequests(response.data as Request[]);
      } else {
        setError(response.message || "Error al cargar usuarios interesados");
      }
    } catch (err) {
      setError("Error al cargar usuarios interesados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    onClose();
  };

  const handleClose = () => {
    setRequests([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Usuarios Interesados</h3>
          <Button
            color="danger"
            variant="light"
            size="sm"
            onClick={handleClose}
          >
            ✕
          </Button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-8">
              <p>Cargando usuarios interesados...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-danger">{error}</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-default-500">No hay usuarios interesados</p>
            </div>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Nombre</th>
                  <th className="px-4 py-2 border">Acción</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-4 py-2 border">{request.borrower_name}</td>
                    <td className="px-4 py-2 border">
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleSelectUser(request.borrower_id)}
                      >
                        Seleccionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            color="danger" 
            variant="light" 
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
} 