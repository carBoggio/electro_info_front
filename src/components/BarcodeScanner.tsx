import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
// Importación normal de la biblioteca
import { Html5QrcodeScanner } from "html5-qrcode";

interface BarcodeScannerProps {
  onScan: (barcodeNumber: string) => void;
  buttonText?: string;
  loadingText?: string;
  autoClose?: boolean;
}

const BarcodeScanner = ({
  onScan,
  buttonText = "Escanear Código de Barras",
  loadingText = "Escaneando...",
  autoClose = true
}: BarcodeScannerProps) => {
  const [scanning, setScanning] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerContainerId = "reader"; // Usamos un ID simple y corto

  // Limpieza cuando el componente se desmonta
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          console.error("Error al limpiar el escáner:", e);
        }
      }
    };
  }, []);

  // Estilizar el escáner después de renderizarlo
  useEffect(() => {
    if (scanning) {
      // Aplicar estilos personalizados después de que el escáner se haya renderizado
      setTimeout(() => {
        const scannerElement = document.getElementById(scannerContainerId);
        if (scannerElement) {
          // Ocultar algunos elementos del escáner que no queremos mostrar
          const selectors = [
            "header",
            "div button:not(.html5-qrcode-element)",
            "#reader__dashboard_section_swaplink"
          ];
          
          selectors.forEach(selector => {
            const elements = scannerElement.querySelectorAll(selector);
            elements.forEach(elem => {
              if (elem instanceof HTMLElement) {
                elem.style.display = "none";
              }
            });
          });
          
          // Estilizar el área de escaneo
          const videoElement = scannerElement.querySelector("video");
          if (videoElement instanceof HTMLElement) {
            videoElement.style.borderRadius = "8px";
            videoElement.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }
        }
      }, 500); // Damos más tiempo para que el escáner se renderice completamente
    }
  }, [scanning]);

  const startScanner = () => {
    setError(null);
    setScanning(true);
    
    try {
      // Configuración del escáner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 150 },
        rememberLastUsedCamera: true,
        // Soportar formatos de códigos de barras comunes 
        formatsToSupport: [
          0, // QR_CODE
          2, // CODABAR 
          3, // CODE_39
          4, // CODE_93
          5, // CODE_128
          8, // ITF
          9, // EAN_13
          10, // EAN_8
          13, // UPC_A
          14, // UPC_E
        ]
      };
      
      // Crear una nueva instancia del escáner
      scannerRef.current = new Html5QrcodeScanner(
        scannerContainerId,
        config,
        /* verbose= */ false
      );
      
      // Renderizar el escáner y configurar callbacks
      scannerRef.current.render(
        (decodedText: string) => {
          // Imprimir el código escaneado en la consola
          console.log("Código escaneado:", decodedText);
          
          // Llamar al callback con el texto decodificado
          onScan(decodedText);
          
          // Cerrar el escáner automáticamente si autoClose es true
          if (autoClose) {
            stopScanner();
          }
        },
        (errorMessage: string) => {
          // Ignoramos errores continuos para no llenar la consola
        }
      );
    } catch (err: any) {
      console.error("Error al iniciar el escáner:", err);
      setError(`Error al iniciar el escáner: ${err.message || err}`);
      setScanning(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
        scannerRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error("Error al detener el escáner:", err);
      }
    }
  };

  const toggleScanner = () => {
    if (scanning) {
      stopScanner();
    } else {
      startScanner();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}
      
      <Button
        color="primary"
        onClick={toggleScanner}
        className="w-full max-w-xs shadow-md hover:shadow-lg transition-shadow"
        size="lg"
      >
        {scanning ? "Cancelar Escaneo" : buttonText}
      </Button>
      
      {/* El contenedor siempre existe en el DOM para que el escáner pueda encontrarlo */}
      <div className={scanning ? "block" : "hidden"}>
        <Card className="w-full mt-4 overflow-hidden">
          <CardBody className="p-4">
            <div 
              id={scannerContainerId} 
              className="w-full"
            ></div>
          </CardBody>
        </Card>
      </div>
      
      <div className="text-sm text-gray-500 text-center mt-2">
        {scanning && "Si tienes problemas, asegúrate de que la cámara tenga buena iluminación y el código esté claramente visible."}
      </div>
    </div>
  );
};

export default BarcodeScanner;