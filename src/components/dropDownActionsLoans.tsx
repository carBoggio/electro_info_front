import { Prestamo } from "@/types";
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
} from "@heroui/dropdown";
import { DotsThree } from "phosphor-react";
import { useNavigate } from "react-router-dom";

type Key = string | number;

const DropdownActionsLoans = (prestamo: Prestamo) => {
  const navigate = useNavigate();

  const handleAction = (key: Key) => {
    const keyString = String(key);

    switch (keyString) {
      case "detalles":
        navigate(`/prestamos/${prestamo.id}`);
        break;
      case "devolver":
        navigate(`/prestamos/${prestamo.id}/devolver`);
        break;
      case "renovar":
        navigate(`/prestamos/${prestamo.id}/renovar`);
        break;
      case "perfil":
        navigate(`/usuarios/${prestamo.usuarioId}`);
        break;
    }
  };

  // No deshabilita ninguna acción
  const disabledKeys: Key[] = [];

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