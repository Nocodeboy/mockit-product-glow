
-- Crear bucket para almacenar las imágenes generadas
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-mockups', 'user-mockups', true);

-- Crear políticas para el bucket user-mockups
CREATE POLICY "Usuarios pueden ver todas las imágenes" ON storage.objects
FOR SELECT USING (bucket_id = 'user-mockups');

CREATE POLICY "Usuarios pueden subir sus propias imágenes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'user-mockups' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuarios pueden actualizar sus propias imágenes" ON storage.objects
FOR UPDATE USING (bucket_id = 'user-mockups' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuarios pueden eliminar sus propias imágenes" ON storage.objects
FOR DELETE USING (bucket_id = 'user-mockups' AND auth.uid()::text = (storage.foldername(name))[1]);
