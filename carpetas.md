softed/
├── backend/                 # Node.js + Express
│   ├── src/
│    ├── config/              # Configuración DB, CORS, etc.
│    ├── backups/              # todos los backups que se ah hecho puestos por fecha
│    ├── database/              # donde se aloga el backup principal cuando se reinicia la bd
│    ├── controllers/         # Lógica de negocio por módulo
│    ├── middlewares/         # JWT, manejo de errores, permisos
│    ├── helpers/         # funciones
│    ├── libs/         # file-firname y el jwt.js
│    ├── log/         # una funcion para los logs
│    ├── models/              # Definición de modelos Sequelize
│    ├── img/              # Imagenes como logos y phtoos de perfil
│    ├── routes/              # Rutas API organizadas por módulo
│    ├── services/            # Lógica reutilizable (e.g. envío de correos)
│   └── index.js             # Entrada principal del backend
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── assets/          # Imágenes, logos, estilos
│   │   ├── api/          
│   │   ├── components/    # Componentes reutilizables (Button, Navbar)
│   │   ├── context/        
│   │   ├── helpers/          
│   │   ├── page/          
│   │   ├── theme/        
│   │   └── App.jsx
│   │   └── App.css
│   │   └── index.css
│   │   └── main.jsx
│   │   └── slidercoverflow.css
│   └── index.html
│
├── database/                # Scripts SQL, backups, etc.
└── README.md                # Descripción general del proyecto
