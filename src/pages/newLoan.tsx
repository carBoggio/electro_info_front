import { useState } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Radio, RadioGroup } from "@heroui/radio";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";

import DefaultLayout from "@/layouts/default";
import { Libro, LibroUbicacion } from "@/types";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function NewLoanPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [userIdentified, setUserIdentified] = useState<boolean>(false);
  const [scanningNfc, setScanningNfc] = useState<boolean>(false);
  const [barcodeNumber, setBarcodeNumber] = useState<string>("");
  
  // Datos de ejemplo - mantenemos los datos mockeados originales
  const librosDisponibles: Libro[] = [
    { 
      id: "1", 
      titulo: "Crónica de una muerte anunciada", 
      autor: "Gabriel García Márquez", 
      genero: "Novela", 
      disponibles: 3, 
      imagen: "/placeholder-book.jpg",
      ubicacion: LibroUbicacion.GRADO
    },
    { 
      id: "2", 
      titulo: "El señor de los anillos", 
      autor: "J.R.R. Tolkien", 
      genero: "Fantasía", 
      disponibles: 2, 
      imagen: "/placeholder-book.jpg",
      ubicacion: LibroUbicacion.CIENCIAS_BIOMEDICAS
    },
    { 
      id: "3", 
      titulo: "El alquimista", 
      autor: "Paulo Coelho", 
      genero: "Ficción", 
      disponibles: 5, 
      imagen: "/placeholder-book.jpg",
      ubicacion: LibroUbicacion.GRADO
    },
    { 
      id: "4", 
      titulo: "Rayuela", 
      autor: "Julio Cortázar", 
      genero: "Novela", 
      disponibles: 1, 
      imagen: "/placeholder-book.jpg",
      ubicacion: LibroUbicacion.GRADO
    },
  ];

  // Filtrar libros según la búsqueda
  const librosFilteredBySearch = searchTerm 
    ? librosDisponibles.filter(libro => 
        libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        libro.autor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : librosDisponibles;

  const handleSelectBook = (book: Libro) => {
    setSelectedBook(book);
  };

  const handleScanNfc = () => {
    setScanningNfc(true);
    // Simulación de escaneo NFC
    setTimeout(() => {
      setScanningNfc(false);
      setUserIdentified(true);
    }, 2000);
  };

  // Función que maneja el escaneo del código de barras
  const handleBarcodeScanned = (barcode: string) => {
    setBarcodeNumber(barcode);
      console.log("Código de barras escaneado:", barcode);
    // Simulamos la selección de un libro usando los datos mockeados
    const randomIndex = Math.floor(Math.random() * librosDisponibles.length);
    handleSelectBook(librosDisponibles[randomIndex]);
  };

  const handleConfirmPrestamo = () => {
    if (selectedBook) {
      alert(`Préstamo del libro "${selectedBook.titulo}" (código: ${barcodeNumber}) realizado con éxito`);
    }
  };

  return (
    <DefaultLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Nuevo Préstamo</h1>
          <p className="text-lg text-default-500">
            Escanea un libro y identifícate para realizar un préstamo
          </p>
        </div>

        {/* Tarjeta de identificación de usuario */}
        <Card shadow="md" radius="lg" className="w-full">
          <CardHeader>
            <h2 className="text-xl font-semibold">Identificación de usuario</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center py-4">
              {!userIdentified ? (
                <>
                  <p className="text-lg mb-4 text-default-600">
                    {scanningNfc 
                      ? "Escaneando tarjeta NFC. Por favor, acerca tu tarjeta al lector..." 
                      : "Esperando identificación del usuario"
                    }
                  </p>
                  <Button
                    color="primary"
                    onClick={handleScanNfc}
                    isLoading={scanningNfc}
                  >
                    {scanningNfc ? "Escaneando..." : "Escanear Tarjeta NFC"}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-lg text-success font-medium mb-2">Usuario identificado correctamente</p>
                  <p className="text-xl font-bold">Laura González</p>
                  <p className="text-default-500">Tarjeta Austral #12345678</p>
                  <Button 
                    color="danger" 
                    variant="light" 
                    onClick={() => setUserIdentified(false)}
                    className="mt-4"
                  >
                    Cambiar usuario
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Tarjeta de escaneo de libro */}
        <Card shadow="md" radius="lg" className="w-full">
          <CardHeader>
            <h2 className="text-xl font-semibold">Selección de libro</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center py-4">
              {!selectedBook ? (
                <>
                  <div className="flex flex-col items-center gap-6 mb-4">
                    {/* Implementación del BarcodeScanner */}
                    <BarcodeScanner 
                      onScan={handleBarcodeScanned} 
                      buttonText="Escanear Código de Barras"
                      autoClose={true} // Se cerrará automáticamente después de escanear
                    />
                    <Divider className="my-4 w-full" />
                    
                    <p className="text-default-500">o busca el libro manualmente:</p>
                  </div>
                  
                  <div className="w-full">
                    <Input
                      placeholder="Buscar por título o autor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-4"
                    />
                    
                    <Table 
                      aria-label="Tabla de libros disponibles"
                      selectionMode="single"
                      onRowAction={(key) => {
                        const book = librosDisponibles.find(b => b.id === key.toString());
                        if (book) {
                          handleSelectBook(book);
                        }
                      }}
                    >
                      <TableHeader>
                        <TableColumn>TÍTULO</TableColumn>
                        <TableColumn>AUTOR</TableColumn>
                        <TableColumn>GÉNERO</TableColumn>
                        <TableColumn>UBICACIÓN</TableColumn>
                        <TableColumn>DISPONIBLES</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {librosFilteredBySearch.map((libro) => (
                          <TableRow key={libro.id}>
                            <TableCell>{libro.titulo}</TableCell>
                            <TableCell>{libro.autor}</TableCell>
                            <TableCell>{libro.genero}</TableCell>
                            <TableCell>{libro.ubicacion === LibroUbicacion.GRADO ? "Grado" : "Ciencias Biomédicas"}</TableCell>
                            <TableCell>{libro.disponibles}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-lg text-success font-medium mb-2">Libro seleccionado correctamente</p>
                  <p className="text-xl font-bold">{selectedBook.titulo}</p>
                  <p className="text-default-500">por {selectedBook.autor}</p>
                  {barcodeNumber && (
                    <p className="text-default-500 mt-2">Código: {barcodeNumber}</p>
                  )}
                  <Button 
                    color="danger" 
                    variant="light" 
                    onClick={() => {
                      setSelectedBook(null);
                      setBarcodeNumber("");
                    }}
                    className="mt-4"
                  >
                    Cambiar selección
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Tarjeta de confirmación (solo se muestra cuando hay libro seleccionado y usuario identificado) */}
        {selectedBook && userIdentified && (
          <Card shadow="md" radius="lg" className="w-full">
            <CardHeader>
              <h2 className="text-xl font-semibold">Confirmar préstamo</h2>
            </CardHeader>
            <CardBody>
              <div className="flex flex-col md:flex-row gap-6">
                <Image
                  src={selectedBook.imagen || "/placeholder-book.jpg"}
                  alt={selectedBook.titulo}
                  width={180}
                  height={270}
                  className="object-cover rounded-md"
                />
                
                <div className="space-y-4 flex-1">
                  <h3 className="text-2xl font-bold">{selectedBook.titulo}</h3>
                  <p className="text-xl text-default-500">{selectedBook.autor}</p>
                  <p className="text-default-500">
                    <span className="font-medium">Ubicación:</span> {
                      selectedBook.ubicacion === LibroUbicacion.GRADO 
                        ? "Biblioteca de Grado" 
                        : "Biblioteca de Ciencias Biomédicas"
                    }
                  </p>
                  
                  <Divider />
                  
                  <div>
                    <h4 className="text-lg font-medium mb-2">Duración del préstamo</h4>
                    <RadioGroup defaultValue="14">
                      <Radio value="7">7 días</Radio>
                      <Radio value="14">14 días (Estándar)</Radio>
                      <Radio value="30">30 días (Especial)</Radio>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
              <Button color="danger" variant="light" onClick={() => setSelectedBook(null)}>
                Cancelar
              </Button>
              <Button color="primary" onClick={handleConfirmPrestamo}>
                Confirmar Préstamo
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DefaultLayout>
  );
}