-- Fragrance Parl initial schema (Postgres / Neon)
-- Apply this once to a fresh Neon database. After this, drizzle-kit generates
-- additional migrations from src/db/schema.ts.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- Enums
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE "user_role_type" AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "product_note_type" AS ENUM ('top', 'middle', 'base');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "order_status" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- Auth.js tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text,
  "email" text NOT NULL UNIQUE,
  "emailVerified" timestamptz,
  "image" text,
  "password_hash" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "accounts" (
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  PRIMARY KEY ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "sessionToken" text PRIMARY KEY,
  "userId" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires" timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS "verificationTokens" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamptz NOT NULL,
  PRIMARY KEY ("identifier", "token")
);

-- ============================================================================
-- Application tables
-- ============================================================================
CREATE TABLE IF NOT EXISTS "user_role" (
  "user_id" uuid PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
  "role" "user_role_type" NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS "fragrance_families" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL UNIQUE,
  "icon" text
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "description" text,
  "fragrance_family_id" integer REFERENCES "fragrance_families"("id") ON DELETE SET NULL,
  "slug" text NOT NULL UNIQUE,
  "is_active" boolean NOT NULL DEFAULT true,
  "price" double precision,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "products_slug_idx" ON "products"("slug");
CREATE INDEX IF NOT EXISTS "products_is_active_idx" ON "products"("is_active");

CREATE TABLE IF NOT EXISTS "product_variants" (
  "id" serial PRIMARY KEY,
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "size_ml" integer NOT NULL,
  "price" double precision NOT NULL,
  "stock_quantity" integer NOT NULL DEFAULT 0,
  "is_out_of_stock" boolean NOT NULL DEFAULT false,
  "is_restocked" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "product_variants_product_id_idx" ON "product_variants"("product_id");
CREATE UNIQUE INDEX IF NOT EXISTS "product_variants_product_size_unique" ON "product_variants"("product_id", "size_ml");

CREATE TABLE IF NOT EXISTS "product_images" (
  "id" serial PRIMARY KEY,
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "image_url" text NOT NULL,
  "is_primary" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "product_images_product_id_idx" ON "product_images"("product_id");

CREATE TABLE IF NOT EXISTS "product_notes" (
  "id" serial PRIMARY KEY,
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "note_name" text NOT NULL,
  "note_type" "product_note_type" NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "product_notes_product_id_idx" ON "product_notes"("product_id");

CREATE TABLE IF NOT EXISTS "cart" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
  "sub_total" double precision NOT NULL DEFAULT 0,
  "delivery_fee" double precision NOT NULL DEFAULT 0,
  "total" double precision NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "cart_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "size_ml" integer NOT NULL,
  "quantity" integer NOT NULL DEFAULT 1,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "cart_items_user_id_idx" ON "cart_items"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "cart_items_user_product_size_unique" ON "cart_items"("user_id", "product_id", "size_ml");

CREATE TABLE IF NOT EXISTS "addresses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "full_name" text NOT NULL,
  "email" text NOT NULL,
  "phone" text NOT NULL,
  "address_line" text NOT NULL,
  "city" text NOT NULL,
  "region" text NOT NULL,
  "instructions" text,
  "is_default" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "addresses_user_id_idx" ON "addresses"("user_id");

CREATE TABLE IF NOT EXISTS "favorites" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "favorites_user_id_idx" ON "favorites"("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "favorites_user_product_unique" ON "favorites"("user_id", "product_id");

CREATE TABLE IF NOT EXISTS "orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "order_number" text NOT NULL UNIQUE,
  "status" "order_status" NOT NULL DEFAULT 'pending',
  "subtotal" double precision NOT NULL,
  "delivery_fee" double precision NOT NULL,
  "total" double precision NOT NULL,
  "addresses_id" uuid REFERENCES "addresses"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "orders_user_id_idx" ON "orders"("user_id");
CREATE INDEX IF NOT EXISTS "orders_created_at_idx" ON "orders"("created_at");

CREATE TABLE IF NOT EXISTS "order_items" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "product_id" uuid REFERENCES "products"("id") ON DELETE SET NULL,
  "product_name" text NOT NULL,
  "size_ml" integer NOT NULL,
  "price" double precision NOT NULL,
  "quantity" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items"("order_id");

CREATE TABLE IF NOT EXISTS "order_tracking" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
  "status" "order_status" NOT NULL,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "order_tracking_order_id_idx" ON "order_tracking"("order_id");
