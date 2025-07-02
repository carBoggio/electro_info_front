export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Biblioteca Austral",
  description: "Sistema de gestión de préstamos de libros con tarjeta Austral",
  navItems: [
    {
      label: "Préstamos Activos",
      href: "/prestamos-activos",
    },
    {
      label: "Historial de Préstamos",
      href: "/historial-prestamos",
    },
    {
      label: "Préstamos Vencidos",
      href: "/prestamos-vencidos",
    },
    {
      label: "Libros",
      href: "/libros",
    },
    {
      label: "Campus",
      href: "/campus",
    }
  ],
  navMenuItems: [
    {
      label: "Préstamos Activos",
      href: "/prestamos-activos",
    },
    {
      label: "Historial de Préstamos",
      href: "/historial-prestamos",
    },
    {
      label: "Préstamos Vencidos",
      href: "/prestamos-vencidos",
    },
    {
      label: "Libros",
      href: "/libros",
    },
    {
      label: "Campus",
      href: "/campus",
    },
    {
      label: "Nuevo Préstamo",
      href: "/nuevo-prestamo",
    },
    {
      label: "Mi Perfil",
      href: "/perfil",
    },
    {
      label: "Cerrar Sesión",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/tuusuario/biblioteca-austral",
    website: "https://austral.edu.ar",
  },
};