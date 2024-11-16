# SongBox Frontend
Este repositorio contiene el front-end de la aplicación SongBox, diseñada para brindar una experiencia dinámica a los amantes de la música, permitiéndoles descubrir nuevas canciones, conectarse con otros usuarios y compartir sus recomendaciones favoritas.

## Características de la Aplicación
- **Integración con Spotify**: Requiere autenticación con Spotify para acceder a la aplicación, proporcionando recomendaciones basadas en el historial de escucha del usuario.
- **Componentes Reutilizables**: Uso de `MenuBar` para navegación entre pantallas y `LoadingScreen` para asegurar una experiencia de carga consistente en todas las secciones.
- **Autenticación**: Pantallas de registro e inicio de sesión con videos de fondo para mejorar la experiencia visual.

## Implementaciones Actuales
La aplicación cuenta con las siguientes pantallas ya implementadas y funcionales:

### 1. HomeScreen
- **Carrusel de Noticias**: Presenta las principales noticias de la música.
- **Carrusel de Sección Activa**: Cambia dependiendo de la pestaña seleccionada (News, Videos, Artist), con integración del backend para mostrar datos actualizados desde Spotify.
- **Sección de Recomendaciones**: Recomendaciones personalizadas usando la API de Spotify, con la opción de marcar canciones como favoritas.

### 2. WelcomeScreen, Welcome2Screen
- **Pantallas de Bienvenida**: Tres pantallas consecutivas donde el usuario puede decidir entre Registrarse o Iniciar Sesión.
- **Videos de Fondo**: Cada pantalla cuenta con videos en loop para ofrecer una experiencia atractiva.

### 3. SignInScreen
- **Inicio de Sesión**: Permite a los usuarios ingresar con sus credenciales.

### 4. RegisterScreen
- **Registro de Usuario**: Proceso de registro para nuevos usuarios.

### 5. SearchScreen
- **Buscador General**: Permite buscar álbumes, canciones, artistas, perfiles y playlists.

### 6. ProfileScreen
- **Perfil del Usuario**: Muestra el perfil del usuario, incluyendo su foto y nombre.
- **Mis Álbumes Favoritos**: Un carrusel horizontal de los álbumes a los que el usuario ha dado 'Me gusta'.
- **Mis Canciones Favoritas**: Un carrusel que se desplaza verticalmente para mostrar las canciones favoritas del usuario.

## Pantallas y Funcionalidades No Integradas
Por el momento, las siguientes pantallas aún no están completamente integradas o presentan fallas que impiden su correcto funcionamiento:
- **AlbumDetailsScreen**: Aún no completamente desarrollada.
- **ArtistDetailsScreen**: En proceso de integración.

## Cumplimiento de Requisitos
Esta aplicación actualmente cumple con los requisitos mínimos para la entrega, los cuales incluyen la implementación de al menos tres pantallas funcionales y la integración con servicios externos (Spotify).

## Estructura del Proyecto
- **components**: Contiene componentes reutilizables como `MenuBar`, `LoadingScreen`, y `SearchBar`.
- **screens**: Incluye todas las pantallas de la aplicación:
  - `AlbumDetailsScreen.js`: En desarrollo.
  - `ArtistDetailsScreen.js`: En desarrollo.
  - `HomeScreen.js`: Pantalla principal con varios carruseles y recomendaciones.
  - `ProfileScreen.js`: Pantalla del perfil del usuario, con información personal y favoritos.
  - `RegisterScreen.js`: Registro de usuarios.
  - `SearchScreen.js`: Buscador de canciones, álbumes, artistas y más.
  - `SignInScreen.js`: Inicio de sesión.
  - `WelcomeScreen.js`, `Welcome2.js`: Pantallas iniciales con videos de bienvenida.

## Consideraciones
- **Tokens JWT**: Los tokens de autenticación para interactuar con el backend son dinámicos y no se comparten en el repositorio por razones de seguridad.
- **Integración de Spotify**: Es necesario tener una cuenta de Spotify para la autenticación del usuario y obtención de datos.

## Tecnologías Utilizadas
- **React Native con Expo**: Para el desarrollo móvil.
- **Stack Navigator**: Navegación entre pantallas.
- **Axios**: Para realizar peticiones HTTP al backend.
- **Spotify API**: Integración con Spotify para obtener datos de música y recomendaciones.
