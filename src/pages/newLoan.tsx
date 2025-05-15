import { useState, useEffect } from "react";
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
import { makeLoan } from "@/actions/makeLoan";
import { getAllBooks } from "@/actions/getAllBooks";
import { getBookByCode } from "@/actions/getBookByCode";

export default function NewLoanPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [userIdentified, setUserIdentified] = useState<boolean>(false);
  const [scanningNfc, setScanningNfc] = useState<boolean>(false);
  const [barcodeNumber, setBarcodeNumber] = useState<string>("");
  const [duracionDias, setDuracionDias] = useState<string>("14");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [librosDisponibles, setLibrosDisponibles] = useState<Libro[]>([]);
  const [loadingLibros, setLoadingLibros] = useState<boolean>(true);
  const [scanningError, setScanningError] = useState<string>("");
  
  // ID del usuario simulado para la demo
  const usuarioId = "12345678";

  // Cargar libros disponibles al montar el componente
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoadingLibros(true);
        const books = await getAllBooks();
        setLibrosDisponibles(books);
      } catch (error) {
        console.error("Error al cargar libros:", error);
      } finally {
        setLoadingLibros(false);
      }
    };

    fetchBooks();
  }, []);

  // Filtrar libros según la búsqueda
  const librosFilteredBySearch = searchTerm 
    ? librosDisponibles.filter(libro => 
        libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
        libro.autor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : librosDisponibles;

  const handleSelectBook = (book: Libro) => {
    setSelectedBook(book);
    setScanningError("");
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
  const handleBarcodeScanned = async (barcode: string) => {
    try {
      setBarcodeNumber(barcode);
      setIsLoading(true);
      setScanningError("");
      console.log("Código de barras escaneado:", barcode);
      
      // Buscar el libro por código usando la nueva acción
      const result = await getBookByCode(barcode);
      
      if (result.success && result.libro) {
        // Libro encontrado, seleccionarlo
        handleSelectBook(result.libro);
      } else {
        // Libro no encontrado, mostrar error
        setScanningError(result.message);
      }
    } catch (error) {
      console.error("Error al escanear código de barras:", error);
      setScanningError("Error al procesar el código. Inténtelo nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPrestamo = async () => {
    if (!selectedBook || !userIdentified) return;
    
    try {
      setIsConfirming(true);
      
      // Llamar a la acción makeLoan
      const result = await makeLoan(
        selectedBook,
        usuarioId,
        parseInt(duracionDias),
        barcodeNumber
      );
      
      if (result.success) {
        // Mostrar mensaje de éxito
        alert(result.message);
        
        // Reiniciar el formulario
        setSelectedBook(null);
        setUserIdentified(false);
        setBarcodeNumber("");
        setDuracionDias("14");
        setScanningError("");
      } else {
        throw new Error("Error al realizar el préstamo");
      }
    } catch (error) {
      console.error("Error al realizar el préstamo:", error);
      alert("Ocurrió un error al realizar el préstamo. Inténtelo nuevamente.");
    } finally {
      setIsConfirming(false);
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
                  <p className="text-default-500">Tarjeta Austral #{usuarioId}</p>
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
                    
                    {isLoading && (
                      <p className="text-default-600">Buscando libro con código...</p>
                    )}
                    
                    {scanningError && (
                      <p className="text-danger">{scanningError}</p>
                    )}
                    
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
                    
                    {loadingLibros ? (
                      <div className="flex justify-center p-8">
                        <p>Cargando libros disponibles...</p>
                      </div>
                    ) : (
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
                        <TableBody emptyContent="No hay libros disponibles">
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
                    )}
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
                      setScanningError("");
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
                    <RadioGroup 
                      value={duracionDias} 
                      onValueChange={setDuracionDias}
                    >
                      <Radio value="7">7 días</Radio>
                      <Radio value="14">14 días (Estándar)</Radio>
                      <Radio value="30">30 días (Especial)</Radio>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter className="flex justify-end gap-2">
              <Button 
                color="danger" 
                variant="light" 
                onClick={() => setSelectedBook(null)}
                isDisabled={isConfirming}
              >
                Cancelar
              </Button>
              <Button 
                color="primary" 
                onClick={handleConfirmPrestamo}
                isLoading={isConfirming}
              >
                Confirmar Préstamo
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </DefaultLayout>
  );
}