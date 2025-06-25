import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { getAllBooks } from "@/actions/getAllBooks";
import { createBook, CreateBookData } from "@/actions/createBook";
import { deleteBook } from "@/actions/deleteBook";
import { Libro } from "@/types";
import DefaultLayout from "@/layouts/default";

export default function BooksPage() {
  const [books, setBooks] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterCampus, setFilterCampus] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteBookId, setDeleteBookId] = useState("");
  const [createFormData, setCreateFormData] = useState<CreateBookData>({
    code: "",
    title: "",
    author: "",
    category: "",
    campus: "",
  });

  // Cargar libros al montar el componente
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      setBooks(response || []);
    } catch (error) {
      console.error("Error loading books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar libros
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || book.genero === filterCategory;
    const matchesCampus = !filterCampus || book.ubicacion === filterCampus;
    
    return matchesSearch && matchesCategory && matchesCampus;
  });

  // Obtener categorías y campus únicos
  const categories = [...new Set(books.map(book => book.genero).filter(Boolean))];
  const campuses = [...new Set(books.map(book => book.ubicacion).filter(Boolean))];

  // Crear libro
  const handleCreateBook = async () => {
    try {
      const response = await createBook(createFormData);
      if (response.success) {
        setShowCreateForm(false);
        setCreateFormData({ code: "", title: "", author: "", category: "", campus: "" });
        loadBooks();
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
        loadBooks();
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error al eliminar el libro");
    }
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
            >
              Agregar Libro
            </Button>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Buscar por título, autor o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Input
                placeholder="Filtrar por categoría"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              />
              <Input
                placeholder="Filtrar por campus"
                value={filterCampus}
                onChange={(e) => setFilterCampus(e.target.value)}
              />
              <Button 
                variant="flat" 
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
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
                  <TableColumn>CATEGORÍA</TableColumn>
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
                      <TableCell>
                        <Chip color="primary" variant="flat" size="sm">
                          {book.genero || "Sin categoría"}
                        </Chip>
                      </TableCell>
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
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" shadow="lg" radius="lg">
            <CardBody className="w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Libro</h3>
              <div className="space-y-4">
                <Input
                  label="Código del libro"
                  placeholder="Ingrese el código del libro"
                  value={createFormData.code}
                  onChange={(e) => setCreateFormData({...createFormData, code: e.target.value})}
                  isRequired
                />
                <Input
                  label="Título"
                  placeholder="Ingrese el título del libro"
                  value={createFormData.title}
                  onChange={(e) => setCreateFormData({...createFormData, title: e.target.value})}
                  isRequired
                />
                <Input
                  label="Autor"
                  placeholder="Ingrese el autor del libro"
                  value={createFormData.author}
                  onChange={(e) => setCreateFormData({...createFormData, author: e.target.value})}
                  isRequired
                />
                <Input
                  label="Categoría"
                  placeholder="Ingrese la categoría del libro"
                  value={createFormData.category}
                  onChange={(e) => setCreateFormData({...createFormData, category: e.target.value})}
                  isRequired
                />
                <Input
                  label="Campus"
                  placeholder="Ingrese el campus del libro"
                  value={createFormData.campus}
                  onChange={(e) => setCreateFormData({...createFormData, campus: e.target.value})}
                  isRequired
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    color="primary" 
                    onClick={handleCreateBook}
                    className="flex-1"
                  >
                    Crear Libro
                  </Button>
                  <Button 
                    color="danger" 
                    variant="flat" 
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Formulario de eliminar libro */}
        {showDeleteForm && (
          <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" shadow="lg" radius="lg">
            <CardBody className="w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Confirmar Eliminación</h3>
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
        )}
      </div>
    </DefaultLayout>
  );
} 