# Chess With Strangers - Video Chess Game

Aplicación de ajedrez en tiempo real con videochat que conecta jugadores aleatoriamente usando WebRTC.

## 🚀 Características

- ✅ **Juego de ajedrez completo** con todas las reglas oficiales
- ✅ **Videollamadas reales** con WebRTC P2P durante el juego
- ✅ **Chat en tiempo real** mientras juegas
- ✅ **Emparejamiento automático** con jugadores aleatorios
- ✅ **Completamente gratuito** - sin costos de servidor
- ✅ **Privacidad protegida** - conexiones directas P2P
- ✅ **Responsive design** - funciona en móvil y desktop
- ✅ **Controles completos** - rendirse, ofrecer tablas, nuevo juego

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Chess.js** para lógica del ajedrez
- **PeerJS** para WebRTC
- **Socket.io Client** para señalización
- **Vite** como bundler

### Backend (Servidor de Señalización)
- **Node.js** con Express
- **Socket.io** para WebSockets
- **Render.com** hosting gratuito

## 🆓 Servicios Gratuitos Utilizados

1. **PeerJS Cloud** - Servidor STUN/TURN gratuito
2. **Render.com** - Hosting backend gratuito (750 horas/mes)
3. **Netlify/Vercel** - Hosting frontend gratuito
4. **Google STUN** - Servidores STUN públicos

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repo>
cd chess-with-strangers
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Configurar el servidor de señalización

#### Opción A: Desplegar en Render.com (Recomendado)
1. Ve a [render.com](https://render.com)
2. Conecta tu repositorio
3. Crea un "Web Service"
4. Configura la carpeta `server/`
5. Build Command: `npm install`
6. Start Command: `npm start`

#### Opción B: Servidor local
```bash
cd server
npm install
npm start
```

### 4. Actualizar la URL del servidor
En `src/services/WebRTCService.ts` y `src/services/ChessGameService.ts`, cambia:
```typescript
private readonly SIGNALING_SERVER = 'https://tu-app.onrender.com';
```

### 5. Ejecutar la aplicación
```bash
npm run dev
```

## 🌐 Despliegue en Producción

### Frontend (Netlify/Vercel)
1. Conecta tu repositorio a Netlify o Vercel
2. Build command: `npm run build`
3. Publish directory: `dist`
4. ¡Listo!

### Backend (Render.com)
1. El servidor se despliega automáticamente
2. URL disponible en: `https://tu-app.onrender.com`

## 🔧 Configuración

### Variables de entorno (opcional)
```env
VITE_SIGNALING_SERVER=https://tu-servidor.onrender.com
```

### CORS
Actualiza las URLs permitidas en `server/server.js`:
```javascript
origin: ["http://localhost:5173", "https://tu-app.netlify.app"]
```

## 🚀 Características del Juego

### Ajedrez
- **Reglas completas**: Movimientos legales, enroque, captura al paso, promoción
- **Detección de jaque y jaque mate**
- **Detección de tablas**: Ahogado, repetición, material insuficiente
- **Interfaz visual**: Tablero interactivo con coordenadas
- **Indicadores visuales**: Movimientos posibles, último movimiento

### Video Chat
- **WebRTC P2P**: Conexiones directas entre jugadores
- **Controles de cámara y micrófono**
- **Chat de texto** durante la partida
- **Reconexión automática** si se pierde la conexión

### Funcionalidades del Juego
- **Rendirse**: Terminar la partida inmediatamente
- **Ofrecer tablas**: Proponer empate al oponente
- **Nuevo juego**: Buscar otro oponente
- **Estado del juego**: Información en tiempo real

## 🔒 Privacidad y Seguridad

- Las videollamadas son **P2P directas**
- No se almacenan videos, mensajes ni partidas
- Conexiones encriptadas con WebRTC
- Sin registro de usuarios requerido

## 📱 Compatibilidad

- ✅ Chrome/Chromium 60+
- ✅ Firefox 55+  
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Móviles con navegadores modernos

## 🐛 Solución de Problemas

### "Failed to access camera/microphone"
- Permite acceso a cámara/micrófono en el navegador
- Usa HTTPS en producción (requerido para WebRTC)

### "Connection error occurred"
- Verifica que el servidor de señalización esté funcionando
- Revisa la consola del navegador para errores

### "Game not found"
- Es normal si el oponente se desconecta
- Prueba iniciando un nuevo juego

## 📄 Licencia

MIT License - Uso libre para proyectos personales y comerciales.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Disfruta jugando ajedrez con personas de todo el mundo! ♟️**