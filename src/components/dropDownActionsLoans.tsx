import { PrestamoEstado } from "@/types";

// Interfaz que define qué datos necesita como mínimo el dropdown
export interface PrestamoDropdown {
  id: string;
  usuario: string;
  usuarioId: string;
  estado: PrestamoEstado;
}

// Props del componente
interface DropdownActionsLoansProps {
  prestamo: PrestamoDropdown;
  onDevolver?: (prestamoId: string | number) => void;
  onRenovar?: (prestamoId: string | number) => void;
  onVerDetalles: (prestamoId: string | number) => void;
  onVerPerfil: (usuarioId: string) => void;
  onVerHistorial: (usuarioId: string) => void;
}

const DropdownActionsLoans = ({ 
  prestamo, 
  onDevolver, 
  onRenovar, 
  onVerDetalles,
  onVerPerfil,
  onVerHistorial
}: DropdownActionsLoansProps) => {
  // Implementación del dropdown de acciones
  return (
    <div className="flex gap-2">
      <button 
        className="text-primary text-sm hover:underline" 
        onClick={() => onVerDetalles(prestamo.id)}
      >
        Ver detalles
      </button>
      
      {onDevolver && prestamo.estado === PrestamoEstado.ACTIVO && (
        <button 
          className="text-success text-sm hover:underline"
          onClick={() => onDevolver(prestamo.id)}
        >
          Devolver
        </button>
      )}
      
      {onRenovar && prestamo.estado === PrestamoEstado.ACTIVO && (
        <button 
          className="text-warning text-sm hover:underline"
          onClick={() => onRenovar(prestamo.id)}
        >
          Renovar
        </button>
      )}
      
      <button 
        className="text-secondary text-sm hover:underline" 
        onClick={() => onVerPerfil(prestamo.usuarioId)}
      >
        Ver perfil
      </button>
      
      <button 
        className="text-info text-sm hover:underline" 
        onClick={() => onVerHistorial(prestamo.usuarioId)}
      >
        Historial
      </button>
    </div>
  );
};

export default DropdownActionsLoans;