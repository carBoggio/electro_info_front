import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  // Estado local para manejar el tema
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // Detectar el tema inicial del sistema o configuración guardada
  useEffect(() => {
    // Comprobar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    } else {
      // Comprobar la preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(prefersDark);
      
      // También verificar si el HTML tiene clase 'dark'
      const hasClassDark = document.documentElement.classList.contains('dark');
      if (hasClassDark) setIsDarkTheme(true);
    }
  }, []);
  
  // Escuchar cambios en el tema
  useEffect(() => {
    const handleThemeChange = () => {
      const hasClassDark = document.documentElement.classList.contains('dark');
      setIsDarkTheme(hasClassDark);
      localStorage.setItem('theme', hasClassDark ? 'dark' : 'light');
    };
    
    // Observar cambios en la clase del elemento HTML
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Función para cambiar el tema manualmente
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    // Actualizar la clase en el HTML
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Guardar la preferencia
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="py-2">
      {/* Contenedor principal - separa los dos grupos lo máximo posible */}
      <div className="container mx-auto flex items-center justify-between w-full">
        {/* GRUPO ROJO: Logo y enlaces principales */}
        <div className="flex items-center gap-8">
          {/* Logo y título */}
          <Link
            className="flex justify-start items-center gap-3"
            color="foreground"
            href="/"
          >
            {/* Mostrar logo según el tema actual */}
            {isDarkTheme ? (
              <img 
                src="/logo_austral_blanco.svg" 
                alt="Logo Austral" 
                className="w-8 h-8"
              />
            ) : (
              <img 
                src="/logo_austral_blanco.svg" 
                alt="Logo Austral" 
                className="w-8 h-8"
                style={{ filter: "brightness(0) saturate(100%) invert(11%) sepia(63%) saturate(3584%) hue-rotate(196deg) brightness(92%) contrast(101%)" }}
              />
            )}
            <p className="font-bold text-inherit">Biblioteca Austral</p>
          </Link>

          {/* Enlaces de navegación principales - escritorio */}
          <div className="hidden lg:flex items-center">
            <nav className="flex items-center gap-8">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium text-base"
                  )}
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* GRUPO VERDE: Botón de nuevo préstamo y theme switch */}
        <div className="flex items-center gap-4">
          <Button
            as={Link}
            className="hidden lg:flex text-base font-normal"
            href="/nuevo-prestamo"
            color="primary"
            variant="flat"
            size="lg"
          >
            Nuevo Préstamo
          </Button>
          
          {/* Switch de tema personalizado que usa nuestro estado */}
          <div onClick={toggleTheme} className="cursor-pointer">
            <ThemeSwitch />
          </div>
          
          {/* Toggle del menú móvil */}
          <div className="flex lg:hidden">
            <NavbarMenuToggle />
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <NavbarMenu>
        <div className="mx-4 mt-6 flex flex-col gap-6">
          {siteConfig.navItems.map((item) => (
            <NavbarMenuItem key={item.href}>
              <Link
                color="foreground"
                href={item.href}
                size="lg"
                className="text-lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Link
              color="primary"
              href="/nuevo-prestamo"
              size="lg"
              className="text-lg"
            >
              Nuevo Préstamo
            </Link>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};