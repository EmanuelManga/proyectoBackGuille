# Fakevi's - Plataforma de E-commerce de Ropa

Fakevi's es una plataforma de comercio electrónico diseñada con el propósito específico de ofrecer una experiencia de compra única en el ámbito de la moda. Desarrollado como proyecto final del curso de backend en Coderhouse, este sistema combina una serie de tecnologías avanzadas para proporcionar una experiencia de usuario atractiva y funcional.

## Características Principales

### Catálogo de Ropa

Fakevi's presenta un amplio catálogo de ropa que abarca desde tendencias actuales hasta clásicos atemporales. Los usuarios pueden explorar diversas categorías, ver detalles de los productos y realizar compras de manera intuitiva.

### Personalización de la Experiencia de Usuario

La plataforma se esfuerza por personalizar la experiencia de compra para cada usuario. Utiliza algoritmos inteligentes que recomiendan productos basados en preferencias anteriores, búsquedas recientes y patrones de compra.

### Seguridad y Gestión de Usuarios

La autenticación de usuarios se gestiona de manera segura con un sistema de registro propio y opciones de inicio de sesión mediante Google y GitHub. Fakevi's implementa medidas de seguridad robustas para proteger la información personal y financiera de los usuarios.

### Tecnologías Utilizadas

El backend del sistema se construye con Node.js y Express, proporcionando una base sólida y eficiente para manejar las operaciones del servidor. La base de datos MongoDB se elige por su flexibilidad y escalabilidad, adecuada para gestionar grandes cantidades de datos de productos y usuarios.

En el frontend, Fakevi's utiliza el motor de plantillas Handlebars para renderizar las vistas de manera dinámica y eficiente. Esto garantiza una interfaz de usuario fluida y receptiva.

-   **Base de Datos:** MongoDB se utiliza como base de datos para almacenar información crucial del sistema. Asegúrate de tener una instancia de MongoDB en ejecución y configura las variables de entorno adecuadas en un archivo `.env`.

-   **Comandos de Inicio:**

    -   `npm run dev`: Inicia la aplicación en modo de desarrollo.
    -   `npm start`: Inicia la aplicación para el despliegue.

-   **Variables de Entorno:** Configura las variables de entorno necesarias en un archivo `.env`.

## Iniciar la Aplicación

1. Clona el repositorio: `git clone https://github.com/EmanuelManga/proyectoBackGuille.git`
2. Ingresa al directorio del proyecto: `cd fakevis`
3. Instala las dependencias: `npm install`
4. Crea un archivo `.env` y configura las variables necesarias.
5. Inicia la aplicación:
    - Modo de Desarrollo: `npm run dev`
    - Despliegue: `npm start`

## Autenticación

Fakevi's ofrece tanto el registro y inicio de sesión propios como la posibilidad de acceder mediante Google y GitHub. Asegúrate de configurar correctamente las credenciales de OAuth para una integración sin problemas.

## Tecnologías Utilizadas

-   Backend: Node.js, Express
-   Base de Datos: MongoDB
-   Frontend: Handlebars

## Contribuir

Si deseas contribuir al desarrollo de Fakevi's, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama para tu contribución: `git checkout -b feature/nueva-caracteristica`.
3. Realiza tus cambios y realiza commit: `git commit -m 'Agrega nueva característica'`.
4. Haz push a tu rama: `git push origin feature/nueva-caracteristica`.
5. Abre un pull request para revisión.

¡Gracias por contribuir!

## Licencia

Este proyecto está bajo la Licencia MIT.
