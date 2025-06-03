const permisos = {
  Programador: [
    {
      name: "Home",
      icon: <HomeIcon />,
      link: "/"
    },
    {
      name: "Reservas",
      icon: <CalendarMonthIcon />,
      link: "/reservas"
    },
    {
      name: "Recepción",
      icon: <LoginIcon />,
      link: "/recepcion"
    },
    {
      name: "Analisis",
      icon: <AnalyticsIcon />,
      link: "/analisis"
    },
    {
      name: "Usuarios",
      icon: <GroupIcon />,
      link: "/usuarios"
    },
    {
      name: "Configuracion",
      icon: <SettingsIcon />,
      menu: {
        items: [
          { name: "Info Hotel", link: "/infoHotel", icon: <AdbIcon /> },
          { name: "Niveles", link: "/nivel", icon: <AdbIcon /> },
        ],
      },
    },
    {
      name: "Programador",
      icon: <TerminalIcon />,
      menu: {
        items: [
          { name: "Comandos", link: "/comandos", icon: <TerminalIcon /> },
          { name: "Logs", link: "/logs", icon: <TerminalIcon /> },
          { name: "Cuentas", link: "/cuentas", icon: <TerminalIcon /> },
          { name: "Componentes", link: "/componentes", icon: <TerminalIcon /> },

        ],
      },
    },
  ],
  Administrador: [
    { name: "Nadadores", link: "/nadadores", icon: <AdbIcon /> },
    { name: "Tiempos", link: "/tiempos", icon: <AdbIcon /> },
  ],
  Usuario: [
    {
      name: "Progreso",
      icon: <AdbIcon />,
      menu: {
        items: [
          { name: "Mi Progreso", link: "/miprogreso", icon: <AdbIcon /> },
        ],
      },
    },
  ],
};