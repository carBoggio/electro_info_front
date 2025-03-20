import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="space-y-12 py-8">
        {/* Encabezado de bienvenida */}
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-5xl font-bold">Bienvenido a la Biblioteca Austral</h1>
          <p className="text-xl text-default-500 max-w-3xl mx-auto">
            Gestiona tus préstamos de libros de manera sencilla y eficiente con nuestro sistema de biblioteca.
          </p>
        </div>

        {/* Tarjetas de acceso rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card shadow="md" radius="lg" isHoverable className="w-full">
            <CardHeader className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/10 p-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Préstamos Activos</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="mb-4">Consulta tus préstamos actuales y gestiona renovaciones.</p>
              <Button as={Link} href="/prestamos-activos" color="primary" variant="flat" fullWidth>
                Ver Préstamos Activos
              </Button>
            </CardBody>
          </Card>

          <Card shadow="md" radius="lg" isHoverable className="w-full">
            <CardHeader className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-danger/10 p-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-danger" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Préstamos Vencidos</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="mb-4">Revisa y regulariza tus préstamos con fecha vencida.</p>
              <Button as={Link} href="/prestamos-vencidos" color="danger" variant="flat" fullWidth>
                Ver Vencimientos
              </Button>
            </CardBody>
          </Card>

          <Card shadow="md" radius="lg" isHoverable className="w-full">
            <CardHeader className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-success/10 p-3 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-success" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v6m-3-3h6"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Nuevo Préstamo</h2>
            </CardHeader>
            <CardBody className="text-center">
              <p className="mb-4">Solicita el préstamo de un nuevo libro de nuestra biblioteca.</p>
              <Button as={Link} href="/nuevo-prestamo" color="success" variant="flat" fullWidth>
                Solicitar Préstamo
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Información general */}
        <Card shadow="md" radius="lg" className="w-full">
          <CardHeader>
            <h2 className="text-2xl font-bold">Información importante</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p>
                La Biblioteca Austral tiene como objetivo facilitar el acceso a material bibliográfico para toda la comunidad universitaria.
              </p>
              
              <h3 className="text-lg font-semibold">Horarios de atención</h3>
              <p>
                Lunes a viernes: 8:00 - 20:00<br />
                Sábados: 9:00 - 13:00
              </p>
              
              <h3 className="text-lg font-semibold">Reglamento</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>El préstamo estándar es por 14 días con posibilidad de renovación.</li>
                <li>Cada usuario puede tener hasta 5 libros en préstamo simultáneamente.</li>
                <li>Los préstamos vencidos pueden generar restricciones en la cuenta.</li>
                <li>En caso de pérdida o daño, se deberá reponer el material.</li>
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}