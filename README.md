# TVO - Talk to Video Online

Aplicación de videochat en tiempo real que conecta usuarios aleatoriamente usando WebRTC.

## 🚀 Características

- ✅ **Videollamadas reales** con WebRTC P2P
- ✅ **Chat en tiempo real** mientras hablas
- ✅ **Emparejamiento automático** con usuarios aleatorios
- ✅ **Completamente gratuito** - sin costos de servidor
- ✅ **Privacidad protegida** - conexiones directas P2P
- ✅ **Responsive design** - funciona en móvil y desktop
- ✅ **Controles completos** - cámara, micrófono, siguiente usuario

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
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
cd tvo-video-chat
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
En `src/services/WebRTCService.ts`, cambia:
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

## 🚀 Características del Chat

### Video Chat
- **WebRTC P2P**: Conexiones directas entre usuarios
- **Controles de cámara y micrófono**
- **Chat de texto** durante la videollamada
- **Reconexión automática** si se pierde la conexión

### Funcionalidades
- **Siguiente usuario**: Buscar otra persona
- **Desconectar**: Terminar la sesión
- **Estado del chat**: Información en tiempo real

## 🔒 Privacidad y Seguridad

- Las videollamadas son **P2P directas**
- No se almacenan videos, mensajes ni conversaciones
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

### "User disconnected"
- Es normal si el otro usuario se desconecta
- Prueba buscando otro usuario

## 📄 Licencia

MIT License - Uso libre para proyectos personales y comerciales.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Disfruta hablando con personas de todo el mundo! 🌍**