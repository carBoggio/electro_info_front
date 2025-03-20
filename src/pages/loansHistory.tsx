import { useState, useCallback } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "@/layouts/default";

// Enums y definición de interfaces
export enum LibroUbicacion {
  GRADO = "grado",
  CIENCIAS_BIOMEDICAS = "ciencias_biomedicas"
}

// Modelo de Libro
export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  isbn?: string;
  editorial?: string;
  anioPublicacion?: number;
  genero?: string;
  disponibles: number;
  imagen?: string;
  descripcion?: string;
  ubicacion: LibroUbicacion; // Ubicación física en la biblioteca
}

// Componente para las acciones de cada libro
interface DropdownActionsLibrosProps {
  libro: Libro;
  onVerDetalles: (libroId: string) => void;
  onReservar?: (libroId: string) => void;
  onSolicitar?: (libroId: string) => void;
}

const DropdownActionsLibros = ({ 
  libro, 
  onVerDetalles, 
  onReservar, 
  onSolicitar 
}: DropdownActionsLibrosProps) => {
  // Aquí iría la implementación del dropdown de acciones
  // Por simplicidad, utilizo botones básicos en este ejemplo
  return (
    <div className="flex gap-2">
      <button 
        className="text-primary text-sm hover:underline" 
        onClick={() => onVerDetalles(libro.id)}
      >
        Ver detalles
      </button>
      
      {onReservar && libro.disponibles > 0 && (
        <button 
          className="text-success text-sm hover:underline"
          onClick={() => onReservar(libro.id)}
        >
          Reservar
        </button>
      )}
      
      {onSolicitar && libro.disponibles === 0 && (
        <button 
          className="text-warning text-sm hover:underline"
          onClick={() => onSolicitar(libro.id)}
        >
          Solicitar
        </button>
      )}
    </div>
  );
};

export default function CatalogoLibrosPage() {
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para el filtro de ubicación
  const [ubicacionFilter, setUbicacionFilter] = useState("todos");
  const navigate = useNavigate();
  
  // Datos de ejemplo - en un caso real vendrían de una API
  const catalogoLibrosCompleto: Libro[] = [
    {
      id: "1",
      titulo: "Fahrenheit 451",
      autor: "Ray Bradbury",
      isbn: "978-0345342966",
      editorial: "Ballantine Books",
      anioPublicacion: 1953,
      genero: "Ciencia ficción",
      disponibles: 3,
      descripcion: "Fahrenheit 451 es una novela distópica del escritor estadounidense Ray Bradbury, publicada en 1953.",
      ubicacion: LibroUbicacion.GRADO
    },
    {
      id: "2",
      titulo: "El retrato de Dorian Gray",
      autor: "Oscar Wilde",
      isbn: "978-0486278070",
      editorial: "Dover Publications",
      anioPublicacion: 1890,
      genero: "Novela gótica",
      disponibles: 0,
      descripcion: "El retrato de Dorian Gray es una novela escrita por el autor irlandés Oscar Wilde.",
      ubicacion: LibroUbicacion.GRADO
    },
    {
      id: "3",
      titulo: "Cumbres Borrascosas",
      autor: "Emily Brontë",
      isbn: "978-0141439556",
      editorial: "Penguin Classics",
      anioPublicacion: 1847,
      genero: "Novela gótica",
      disponibles: 2,
      descripcion: "Cumbres Borrascosas es la única novela de la escritora británica Emily Brontë.",
      ubicacion: LibroUbicacion.GRADO
    },
    {
      id: "4",
      titulo: "El lobo estepario",
      autor: "Hermann Hesse",
      isbn: "978-0312278670",
      editorial: "Picador",
      anioPublicacion: 1927,
      genero: "Novela filosófica",
      disponibles: 1,
      descripcion: "El lobo estepario relata la historia de un hombre dividido entre su naturaleza humana y otra salvaje.",
      ubicacion: LibroUbicacion.GRADO
    },
    {
      id: "5",
      titulo: "Mujercitas",
      autor: "Louisa May Alcott",
      isbn: "978-0316489270",
      editorial: "Little, Brown and Company",
      anioPublicacion: 1868,
      genero: "Novela",
      disponibles: 5,
      descripcion: "Mujercitas es una novela de Louisa May Alcott publicada el 30 de septiembre de 1868.",
      ubicacion: LibroUbicacion.GRADO
    },
    {
      id: "6",
      titulo: "Manual de Anatomía Humana",
      autor: "Frank H. Netter",
      isbn: "978-8445826089",
      editorial: "Elsevier",
      anioPublicacion: 2019,
      genero: "Texto académico",
      disponibles: 2,
      descripcion: "Atlas de anatomía humana con ilustraciones detalladas del cuerpo humano.",
      ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS
    },
    {
      id: "7",
      titulo: "Principios de Bioquímica",
      autor: "Albert L. Lehninger",
      isbn: "978-8428214865",
      editorial: "Omega",
      anioPublicacion: 2018,
      genero: "Texto académico",
      disponibles: 0,
      descripcion: "Libro de texto sobre los principios fundamentales de la bioquímica.",
      ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS
    },
    {
      id: "8",
      titulo: "Microbiología Médica",
      autor: "Patrick R. Murray",
      isbn: "978-8491132110",
      editorial: "Elsevier",
      anioPublicacion: 2017,
      genero: "Texto académico",
      disponibles: 3,
      descripcion: "Guía completa sobre microbiología aplicada a la medicina.",
      ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS
    }
  ];

  // Función de filtrado
  const filteredLibros = useCallback(() => {
    return catalogoLibrosCompleto.filter(libro => {
      // Filtro por ubicación
      const ubicacionMatch = ubicacionFilter === "todos" || 
                           libro.ubicacion === ubicacionFilter;
      
      // Filtro por búsqueda
      const searchMatch = 
        searchTerm === "" || 
        libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (libro.genero && libro.genero.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return ubicacionMatch && searchMatch;
    });
  }, [searchTerm, ubicacionFilter, catalogoLibrosCompleto]);

  // Obtener los libros filtrados
  const librosListados = filteredLibros();

  // Handlers para las acciones
  const handleVerDetalles = (libroId: string) => {
    navigate(`/detalles-libro/${libroId}`);
  };

  const handleReservar = (libroId: string) => {
    alert(`Libro #${libroId} reservado con éxito`);
  };

  const handleSolicitar = (libroId: string) => {
    alert(`Solicitud para el libro #${libroId} registrada. Te notificaremos cuando esté disponible.`);
  };

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Catálogo de Libros</h1>
          <p className="text-lg text-default-500">
            Explora nuestra colección de libros disponibles en la biblioteca
          </p>
        </div>

        <Card shadow="md" radius="lg" className="w-full">
          <CardHeader className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Libros en catálogo</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Buscar por título, autor o género"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-1/2"
              />
              
              <Select 
                label="Filtrar por ubicación" 
                selectedKeys={[ubicacionFilter]}
                onChange={(e) => setUbicacionFilter(e.target.value)}
                className="w-full sm:w-1/4"
              >
                <SelectItem key="todos" >Todas las ubicaciones</SelectItem>
                <SelectItem key="grado" >Grado</SelectItem>
                <SelectItem key="ciencias_biomedicas" >Ciencias Biomédicas</SelectItem>
              </Select>
            </div>
          </CardHeader>
          <CardBody>
            <Table aria-label="Tabla de catálogo de libros">
              <TableHeader>
                <TableColumn>TÍTULO</TableColumn>
                <TableColumn>AUTOR</TableColumn>
                <TableColumn>AÑO</TableColumn>
                <TableColumn>GÉNERO</TableColumn>
                <TableColumn>DISPONIBLES</TableColumn>
                <TableColumn>UBICACIÓN</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No se encontraron libros">
                {librosListados.map((libro) => (
                  <TableRow key={libro.id}>
                    <TableCell>{libro.titulo}</TableCell>
                    <TableCell>{libro.autor}</TableCell>
                    <TableCell>{libro.anioPublicacion}</TableCell>
                    <TableCell>{libro.genero}</TableCell>
                    <TableCell>
                      <Chip 
                        color={libro.disponibles > 0 ? "success" : "danger"}
                        variant="flat"
                        size="sm"
                        radius="full"
                      >
                        {libro.disponibles > 0 ? `${libro.disponibles} disponibles` : "No disponible"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={libro.ubicacion === LibroUbicacion.GRADO ? "primary" : "secondary"}
                        variant="flat"
                        size="sm"
                        radius="full"
                      >
                        {libro.ubicacion === LibroUbicacion.GRADO ? "Grado" : "Ciencias Biomédicas"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <DropdownActionsLibros 
                        libro={libro}
                        onVerDetalles={handleVerDetalles}
                        onReservar={handleReservar}
                        onSolicitar={handleSolicitar}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
          <CardFooter className="flex justify-between items-center">
            <p className="text-small text-default-500">Total de libros: {librosListados.length}</p>
            <Pagination total={1} initialPage={1} />
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}