
CREATE OR REPLACE FUNCTION public.vault_read_secret(secret_name TEXT)
RETURNS TABLE (secret TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT decrypted_secret AS secret
  FROM vault.decrypted_secrets
  WHERE name = secret_name;
END;
$$;
