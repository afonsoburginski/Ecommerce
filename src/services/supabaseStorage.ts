// src/services/supabaseStorage.ts
import { supabase } from '@/lib/supabase';

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('Images')
      .upload(`public/${Date.now()}_${file.name}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error || !data) {
      console.error('Erro ao fazer upload da imagem:', error?.message);
      return null;
    }

    const publicUrl = `${supabase.storageUrl}/Images/public/${data.path}`;
    
    if (!publicUrl) {
      console.error('Erro ao obter URL pública da imagem:', data.Key);
      return null;
    }

    console.log('Imagem carregada com sucesso:', publicUrl);
    return publicUrl;
  } catch (err) {
    console.error('Erro inesperado durante o upload da imagem:', err);
    return null;
  }
}
