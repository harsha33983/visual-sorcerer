import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Image as ImageIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ImageSkeleton } from '@/components/ImageSkeleton';
import { LazyImage } from '@/components/LazyImage';

interface StorageItem {
  id: string;
  edited_image_url: string;
  prompt: string;
  created_at: string;
}

const Storage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [images, setImages] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('edit_history')
        .select('id, edited_image_url, prompt, created_at')
        .eq('user_id', user.id)
        .not('edited_image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setImages(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.substring(0, 30)}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: "Downloaded", description: "Image saved to your device" });
    } catch {
      toast({ title: "Error", description: "Failed to download image", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 pt-24">
        {loading ? (
          <ImageSkeleton count={8} heightClass="h-64" />
        ) : error ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border p-12 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={fetchImages}>
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </Card>
        ) : images.length === 0 ? (
          <Card className="bg-card/80 backdrop-blur-sm border-border p-12 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No images saved yet</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((item, i) => (
              <Card
                key={item.id}
                className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-all group overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <LazyImage
                      src={item.edited_image_url}
                      alt={item.prompt}
                      className="w-full h-64"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => downloadImage(item.edited_image_url, item.prompt, e)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.prompt}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Developed by Harshavardhan • Powered by AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Storage;
