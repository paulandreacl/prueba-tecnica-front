# Publicaciones app

App en Next.js para listar, buscar, crear, editar y borrar publicaciones. Los datos vienen de [JSONPlaceholder](https://jsonplaceholder.typicode.com) y los cambios se guardan en el navegador (`localStorage`).

## Requisitos

- Node.js 18+
- npm

## Cómo ejecutar el proyecto

```bash
git clone https://github.com/paulandreacl/prueba-tecnica-front.git
cd prueba-tecnica-front
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Cómo correr en local (producción)

```bash
npm run build
npm run start
```

Abre [http://localhost:3000](http://localhost:3000).

Otros scripts: `npm run lint`.

**Demo en línea:** [https://prueba-tecnica-front-phi.vercel.app](https://prueba-tecnica-front-phi.vercel.app)

## Cómo utilizar la aplicación

| Ruta | Qué hace |
|------|----------|
| `/` | Inicio; enlace al listado |
| `/listado` | Lista con scroll infinito y búsqueda por título o contenido |
| `/detalle/[id]` | Ver una publicación |
| `/nuevo` | Crear publicación |
| `/editar/[id]` | Editar publicación |

En el listado, cada tarjeta tiene:

- **Ojo** — ver detalle
- **Lápiz** — editar
- **Papelera** — eliminar (con confirmación)

Los posts creados o modificados se guardan en `localStorage` del navegador; la API remota no persiste esos cambios.

## Tecnologías

Next.js, TypeScript, HeroUI, Formik, Zustand, Tailwind.

## Notas

- No se necesitan variables de entorno.
- Para restaurar datos de prueba: borra en el navegador `posts_local` y `posts_images`.

## Autor

Paula Andrea Calderón — paulacalderon1509@gmail.com
