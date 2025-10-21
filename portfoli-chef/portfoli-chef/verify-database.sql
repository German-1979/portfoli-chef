-- Script de verificación y corrección para la base de datos
-- Ejecutar en el dashboard de Supabase

-- 1. Verificar estructura de la tabla
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'personal_data' 
ORDER BY ordinal_position;

-- 2. Agregar campos si no existen
ALTER TABLE personal_data 
ADD COLUMN IF NOT EXISTS hero_description TEXT,
ADD COLUMN IF NOT EXISTS about_description TEXT;

-- 3. Verificar políticas RLS existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'personal_data';

-- 4. Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Enable read access for all users" ON personal_data;
DROP POLICY IF EXISTS "Enable insert for all users" ON personal_data;
DROP POLICY IF EXISTS "Enable update for all users" ON personal_data;
DROP POLICY IF EXISTS "Enable all operations for personal_data" ON personal_data;

-- 5. Crear nueva política RLS
CREATE POLICY "Enable all operations for personal_data" ON "public"."personal_data"
AS PERMISSIVE FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- 6. Verificar datos actuales
SELECT id, full_name, profession, hero_description, about_description, created_at, updated_at 
FROM personal_data 
LIMIT 1;

-- 7. Actualizar datos existentes con valores por defecto si están vacíos
UPDATE personal_data 
SET 
  hero_description = COALESCE(hero_description, 'Transformando datos en insights accionables mediante análisis avanzado, visualización y machine learning'),
  about_description = COALESCE(about_description, 'Soy un Ingeniero y Analista de Datos apasionado por descubrir insights valiosos a través del análisis de datos. Con más de X años de experiencia en la industria, he trabajado en proyectos que abarcan desde análisis exploratorio hasta implementación de modelos de machine learning en producción. Me especializo en transformar datos complejos en información accionable que impulsa la toma de decisiones estratégicas.')
WHERE hero_description IS NULL OR about_description IS NULL;



