import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { getAllBooks } from "@/actions/getAllBooks";
import { createBook, CreateBookData } from "@/actions/createBook";
import { deleteBook } from "@/actions/deleteBook";
import { getCampuses, Campus } from "@/actions/getCampuses";
import { Libro } from "@/types";
import DefaultLayout from "@/layouts/default";

export default function BooksPage() {
  const [books, setBooks] = useState<Libro[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [campusesLoading, setCampusesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCampus, setFilterCampus] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState("");
  const [createFormData, setCreateFormData] = useState<CreateBookData>({
    id: "",
    name: "",
    author: "",
    campus: "",
  });

  // Cargar libros y campuses al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setCampusesLoading(true);
      
      const [booksResponse, campusesResponse] = await Promise.all([
        getAllBooks(),
        getCampuses()
      ]);
      
      console.log("Books response:", booksResponse);
      console.log("Campuses response:", campusesResponse);
      console.log("Respuesta cruda de getAllBooks:", booksResponse);
      
      // Verificar que las respuestas sean arrays válidos
      if (Array.isArray(booksResponse)) {
        setBooks(booksResponse);
      } else {
        console.error("Books response is not an array:", booksResponse);
        setBooks([]);
      }
      
      if (Array.isArray(campusesResponse)) {
        setCampuses(campusesResponse);
      } else {
        console.error("Campuses response is not an array:", campusesResponse);
        setCampuses([]);
      }
      
    } catch (error) {
      console.error("Error loading data:", error);
      setBooks([]);
      setCampuses([]);
    } finally {
      setLoading(false);
      setCampusesLoading(false);
    }
  };

  // Filtrar libros
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCampus = !filterCampus || book.ubicacion === filterCampus;
    
    return matchesSearch && matchesCampus;
  });

  // Crear libro
  const handleCreateBook = async () => {
    // Validar campos requeridos
    if (!createFormData.id.trim()) {
      alert("Por favor ingrese el ID del libro");
      return;
    }
    if (!createFormData.name.trim()) {
      alert("Por favor ingrese el nombre del libro");
      return;
    }
    if (!createFormData.author.trim()) {
      alert("Por favor ingrese el autor del libro");
      return;
    }
    if (!createFormData.campus) {
      alert("Por favor seleccione un campus");
      return;
    }

    try {
      const response = await createBook(createFormData);
      if (response.success) {
        setShowCreateForm(false);
        setCreateFormData({ id: "", name: "", author: "", campus: "" });
        await loadData(); // Recargar datos
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error creating book:", error);
      alert("Error al crear el libro");
    }
  };

  // Eliminar libro
  const handleDeleteBook = async () => {
    try {
      const response = await deleteBook(deleteBookId);
      if (response.success) {
        setShowDeleteForm(false);
        setDeleteBookId("");
        await loadData(); // Recargar datos
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error al eliminar el libro");
    }
  };

  // Cerrar formulario de crear
  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
    setCreateFormData({ id: "", name: "", author: "", campus: "" });
  };

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Gestión de Libros</h1>
          <p className="text-lg text-default-500">
            Administra el catálogo de libros de la biblioteca
          </p>
        </div>

        {/* Filtros */}
        <Card shadow="md" radius="lg">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold">Filtros de búsqueda</h2>
            <Button 
              color="primary" 
              onClick={() => setShowCreateForm(true)}
              isDisabled={campusesLoading}
            >
              Agregar Libro
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Buscar por título, autor o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select
                placeholder="Filtrar por campus"
                selectedKeys={filterCampus ? [filterCampus] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setFilterCampus(selected || "");
                }}
              >
                {campuses.map((campus) => (
                  <SelectItem key={campus.name}>
                    {campus.name}
                  </SelectItem>
                ))}
              </Select>
              <Button 
                variant="flat" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterCampus("");
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Tabla de libros */}
        <Card shadow="md" radius="lg">
          <CardHeader>
            <h2 className="text-xl font-semibold">
              Libros ({filteredBooks.length})
            </h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-center py-8">Cargando libros...</div>
            ) : (
              <Table aria-label="Tabla de libros">
                <TableHeader>
                  <TableColumn>CÓDIGO</TableColumn>
                  <TableColumn>TÍTULO</TableColumn>
                  <TableColumn>AUTOR</TableColumn>
                  <TableColumn>CAMPUS</TableColumn>
                  <TableColumn>ESTADO</TableColumn>
                  <TableColumn>ACCIONES</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No hay libros disponibles">
                  {filteredBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{book.codigo}</TableCell>
                      <TableCell className="font-medium">{book.titulo}</TableCell>
                      <TableCell>{book.autor}</TableCell>
                      <TableCell>{book.ubicacion}</TableCell>
                      <TableCell>
                        <Chip 
                          color={book.disponible ? "success" : "danger"} 
                          variant="flat" 
                          size="sm"
                        >
                          {book.disponible ? "Disponible" : "Prestado"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="danger"
                          size="sm"
                          variant="flat"
                          onClick={() => {
                            setDeleteBookId(book.id);
                            setShowDeleteForm(true);
                          }}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Formulario de crear libro */}
        {showCreateForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md m-4" shadow="lg" radius="lg">
              <CardHeader>
                <h3 className="text-xl font-semibold">Agregar Nuevo Libro</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="ID del libro"
                  placeholder="Ingrese el ID del libro"
                  value={createFormData.id}
                  onChange={(e) => setCreateFormData({...createFormData, id: e.target.value})}
                  isRequired
                />
                <Input
                  label="Nombre del libro"
                  placeholder="Ingrese el nombre del libro"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                  isRequired
                />
                <Input
                  label="Autor"
                  placeholder="Ingrese el autor del libro"
                  value={createFormData.author}
                  onChange={(e) => setCreateFormData({...createFormData, author: e.target.value})}
                  isRequired
                />
                <Select
                  label="Campus"
                  placeholder="Seleccione un campus"
                  selectedKeys={createFormData.campus ? [createFormData.campus] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setCreateFormData({...createFormData, campus: selected || ""});
                  }}
                  isRequired
                  isLoading={campusesLoading}
                >
                  {campuses.map((campus) => (
                    <SelectItem key={campus.name}>
                      {campus.name}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex gap-2 pt-4">
                  <Button 
                    color="primary" 
                    onClick={handleCreateBook}
                    className="flex-1"
                    isLoading={false}
                  >
                    Crear Libro
                  </Button>
                  <Button 
                    color="danger" 
                    variant="flat" 
                    onClick={handleCloseCreateForm}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Formulario de eliminar libro */}
        {showDeleteForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-md m-4" shadow="lg" radius="lg">
              <CardHeader>
                <h3 className="text-xl font-semibold">Confirmar Eliminación</h3>
              </CardHeader>
              <CardBody>
                <p className="mb-4">¿Estás seguro de que quieres eliminar este libro? Esta acción no se puede deshacer.</p>
                <div className="flex gap-2">
                  <Button 
                    color="danger" 
                    onClick={handleDeleteBook}
                    className="flex-1"
                  >
                    Eliminar
                  </Button>
                  <Button 
                    variant="flat" 
                    onClick={() => setShowDeleteForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}