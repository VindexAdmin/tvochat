# TVO Signaling Server

Servidor de señalización gratuito para TVO Video Chat.

## Configuración Local

Para desarrollo local, necesitas ejecutar tanto el servidor de señalización como el servidor PeerJS:

### 1. Instalar dependencias
```bash
cd server
npm install
```

### 2. Ejecutar el servidor de señalización
```bash
npm run dev
```

### 3. Ejecutar el servidor PeerJS (en otra terminal)
```bash
cd server
npm run peerjs
```

El servidor de señalización correrá en `http://localhost:3001`
El servidor PeerJS correrá en `http://localhost:9000`

## Despliegue en Render.com (GRATIS)

1. Ve a [render.com](https://render.com) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Crea un nuevo "Web Service"
4. Configura:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free (0$/mes)

## Variables de entorno

No necesitas configurar variables de entorno adicionales.

## Características

- ✅ Emparejamiento automático de usuarios
- ✅ Gestión de rooms en tiempo real  
- ✅ Limpieza automática de conexiones
- ✅ CORS configurado para desarrollo y producción
- ✅ Health check endpoint
- ✅ Servidor PeerJS local para desarrollo
- ✅ Completamente gratuito

## Endpoints

- `GET /` - Estado del servidor
- `GET /health` - Health check

## Eventos Socket.io

- `peer-ready` - Usuario listo para conectar
- `find-match` - Buscar pareja
- `match-found` - Pareja encontrada
- `leave-room` - Salir del room
- `user-disconnected` - Usuario desconectado

## Servidores

- **Servidor de señalización**: Puerto 3001
- **Servidor PeerJS**: Puerto 9000 (solo para desarrollo local)