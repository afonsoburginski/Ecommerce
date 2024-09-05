import { supabase } from '@/lib/supabase';

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const fileName = `product/${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from('Images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error || !data) {
      console.error('Erro ao fazer upload da imagem:', error?.message);
      return null;
    }

    const { data: publicURLData } = supabase
      .storage
      .from('Images')
      .getPublicUrl(fileName);

    const publicUrl = publicURLData?.publicUrl;

    if (!publicUrl) {
      console.error('Erro ao obter URL pública da imagem');
      return null;
    }

    console.log('Imagem carregada com sucesso:', publicUrl);
    return publicUrl;
  } catch (err) {
    console.error('Erro inesperado durante o upload da imagem:', err);
    return null;
  }
}
