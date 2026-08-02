/*
  =============================================================================
  Migration : 20260731093000_secure_public_inserts.sql
  Description : Remplace les policies INSERT publiques sur `reservations` et
                 `orders` par des fonctions RPC SECURITY DEFINER.

  Pourquoi :
  - Le patch de sécurité précédent (20260731090000_security_patch.sql) retire
    toute policy SELECT publique sur `reservations` et `orders` (bon réflexe,
    ces tables contiennent des données clients).
  - Mais le frontend fait `.insert({...}).select().single()` pour récupérer
    l'id créé (utilisé pour déclencher la edge function de notification
    email). Sans policy SELECT, cette relecture échoue côté client alors que
    l'insertion a bien eu lieu.
  - Solution : des fonctions SECURITY DEFINER qui insèrent et renvoient
    uniquement l'uuid créé, sans jamais exposer les autres lignes de la
    table. La validation des champs est faite ici plutôt que dans un simple
    `WITH CHECK`, et le client ne peut plus injecter n'importe quelle colonne
    (ex: status).

  À exécuter après 20260731090000_security_patch.sql.
  =============================================================================
*/

-- =================================================----------------------------
-- 1. FONCTION DE CRÉATION DE RÉSERVATION
-- =================================================----------------------------
CREATE OR REPLACE FUNCTION public.create_reservation(
  p_name text,
  p_email text,
  p_phone text,
  p_date date,
  p_time text,
  p_guests integer,
  p_seating text DEFAULT 'indoor',
  p_special_request text DEFAULT ''
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF length(trim(p_name)) = 0
     OR p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     OR length(trim(p_phone)) = 0
     OR p_guests IS NULL OR p_guests <= 0 OR p_guests > 50
     OR p_date IS NULL OR p_date < CURRENT_DATE
     OR p_time IS NULL OR length(trim(p_time)) = 0
  THEN
    RAISE EXCEPTION 'invalid_reservation_input';
  END IF;

  INSERT INTO public.reservations
    (name, email, phone, date, time, guests, seating, special_request, status)
  VALUES
    (trim(p_name), lower(trim(p_email)), trim(p_phone), p_date, p_time,
     p_guests, coalesce(p_seating, 'indoor'), coalesce(p_special_request, ''), 'pending')
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_reservation(text,text,text,date,text,integer,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_reservation(text,text,text,date,text,integer,text,text) TO anon, authenticated;


-- =================================================----------------------------
-- 2. FONCTION DE CRÉATION DE COMMANDE
-- =================================================----------------------------
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_type text,
  p_address text,
  p_items jsonb,
  p_subtotal numeric,
  p_discount_code text,
  p_total numeric
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF length(trim(p_customer_name)) = 0
     OR length(trim(p_customer_phone)) = 0
     OR p_total IS NULL OR p_total < 0
     OR p_subtotal IS NULL OR p_subtotal < 0
     OR jsonb_typeof(p_items) IS DISTINCT FROM 'array'
     OR jsonb_array_length(p_items) = 0
     OR (p_type = 'delivery' AND length(trim(coalesce(p_address, ''))) = 0)
  THEN
    RAISE EXCEPTION 'invalid_order_input';
  END IF;

  INSERT INTO public.orders
    (customer_name, customer_phone, customer_email, type, address, items,
     subtotal, discount_code, total, status)
  VALUES
    (trim(p_customer_name), trim(p_customer_phone), trim(coalesce(p_customer_email, '')),
     coalesce(nullif(trim(p_type), ''), 'pickup'), trim(coalesce(p_address, '')), p_items,
     p_subtotal, trim(coalesce(p_discount_code, '')), p_total, 'pending')
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.create_order(text,text,text,text,text,jsonb,numeric,text,numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text,text,text,text,text,jsonb,numeric,text,numeric) TO anon, authenticated;


-- =================================================----------------------------
-- 3. RETRAIT DES POLICIES D'INSERT DIRECTES DEVENUES INUTILES
--    (toute création publique passe désormais par les fonctions ci-dessus,
--     qui bypassent la RLS en tant que SECURITY DEFINER)
-- =================================================----------------------------
DROP POLICY IF EXISTS "reservations_insert_public" ON public.reservations;
DROP POLICY IF EXISTS "orders_insert_public" ON public.orders;