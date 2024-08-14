// src/services/supabaseStorage.ts
import { supabase } from '@/lib/supabase';

export async function uploadImage(file: File): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('Images') // Nome do bucket
    .upload(`public/${Date.now()}_${file.name}`, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro ao fazer upload da imagem:', error.message);
    return null;
  }

  const publicUrl = supabase.storage.from('Images').getPublicUrl(data.path).publicURL;
  return publicUrl || null;
}
