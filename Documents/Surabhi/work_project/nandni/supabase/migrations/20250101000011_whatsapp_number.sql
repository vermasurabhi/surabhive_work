-- WhatsApp contact number for footer/social (opens in wa.me). Fallback 91981113892 when empty.
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
