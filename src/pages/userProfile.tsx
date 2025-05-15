import { useParams } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import DefaultLayout from "@/layouts/default";

export default function UserProfilePage() {
  const { userId } = useParams();

  return (
    <DefaultLayout>
      <div className="space-y-8 py-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Perfil de Usuario</h1>
          <p className="text-xl text-default-500">
            Información detallada del usuario
          </p>
        </div>

        <Card className="w-full" shadow="sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-2xl font-semibold">Detalles del Usuario</h2>
          </CardHeader>
          <CardBody className="px-6 py-4">
            <div className="space-y-4">
              <p className="text-default-500">ID del Usuario: {userId}</p>
              {/* Aquí irá la información del usuario cuando se implemente la obtención de datos */}
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
} 