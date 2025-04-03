import { PrestamoEstado } from "@/types";
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
} from "@heroui/dropdown";
import { DotsThree } from "phosphor-react";

// Definimos nosotros el tipo Key ya que no podemos importarlo
type Key = string | number;

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
  
  // Determinar qué acciones están disponibles
  const isActivo = prestamo.estado === PrestamoEstado.ACTIVO;
  
  // Usando nuestro tipo Key
  const handleAction = (key: Key) => {
    // Convertimos a string para poder hacer el switch
    const keyString = String(key);
    
    switch (keyString) {
      case "detalles":
        onVerDetalles(prestamo.id);
        break;
      case "devolver":
        onDevolver && onDevolver(prestamo.id);
        break;
      case "renovar":
        onRenovar && onRenovar(prestamo.id);
        break;
      case "perfil":
        onVerPerfil(prestamo.usuarioId);
        break;
      case "historial":
        onVerHistorial(prestamo.usuarioId);
        break;
    }
  };
  
  // Usando nuestro tipo Key para el array
  const disabledKeys: Key[] = [];
  if (!isActivo || !onDevolver) disabledKeys.push("devolver");
  if (!isActivo || !onRenovar) disabledKeys.push("renovar");
  
  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="p-1 rounded-full hover:bg-gray-100">
          <DotsThree size={24} />
        </button>
      </DropdownTrigger>
      
      <DropdownMenu 
        aria-label="Acciones de préstamo" 
        onAction={handleAction}
        disabledKeys={disabledKeys}
      >
        <DropdownItem key="detalles" className="text-primary">
          Ver detalles
        </DropdownItem>
        
        <DropdownItem key="devolver" className="text-success">
          Devolver
        </DropdownItem>
        
        <DropdownItem key="renovar" className="text-warning">
          Renovar
        </DropdownItem>
        
        <DropdownItem key="perfil" className="text-secondary">
          Ver perfil
        </DropdownItem>
        
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownActionsLoans;