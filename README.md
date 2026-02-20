# KIVO Store

Plataforma e-commerce privada con Next.js + Prisma + PostgreSQL.

## Caracteristicas clave
- Catalogo inicia vacio (sin productos precargados).
- Solo admin autorizado (`ADMIN_EMAIL`) puede gestionar `/admin`.
- Login con Google OAuth (principal) + email/password.
- Recuperacion de password y endpoint de captcha.
- Panel privado: productos, pedidos, clientes, analitica.
- Capa de pagos modular: Stripe, PayPal, transferencia, locales.
- Seguridad base: validacion backend (Zod), rate-limit, cabeceras seguras, logs admin.

## Stack
- Next.js App Router + TypeScript + TailwindCSS.
- NextAuth + Prisma Adapter.
- PostgreSQL (Prisma ORM).

## Setup
1. Copia variables:
```bash
cp .env.example .env
```
2. Instala dependencias:
```bash
npm install
```
3. Genera cliente Prisma y migra:
```bash
npm run prisma:generate
npm run prisma:migrate
```
4. Ejecuta desarrollo:
```bash
npm run dev
```

## Produccion
- Configura `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- Usa HTTPS obligatorio.
- Configura SMTP real para correos de recuperacion/verificacion.
- Configura Stripe/PayPal y webhook de pago.

## Rutas principales
- Publico: `/`, `/catalog`, `/cart`, `/checkout`
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Admin: `/admin`, `/admin/products`, `/admin/orders`, `/admin/customers`, `/admin/analytics`

## Notas
- No existe endpoint publico para crear productos.
- Todo CRUD de productos esta bajo `/api/admin/products` con guardas de admin.