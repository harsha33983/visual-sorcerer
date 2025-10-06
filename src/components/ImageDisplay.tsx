import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageDisplayProps {
  image: string | null;
  title: string;
  showDownload?: boolean;
  emptyMessage?: string;
}

export const ImageDisplay = ({ image, title, showDownload, emptyMessage }: ImageDisplayProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = image;
    link.download = `${title.toLowerCase().replace(' ', '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: `Your ${title.toLowerCase()} is being downloaded!`,
    });
  };

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border p-3 sm:p-4 shadow-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">{title}</h3>
        {showDownload && image && (
          <Button
            onClick={handleDownload}
            size="sm"
            className="bg-gradient-primary hover:opacity-90 h-8 gap-2"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-xs">Download</span>
          </Button>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center min-h-[200px] sm:min-h-[300px] rounded-lg bg-secondary/20 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : (
          <div className="text-center text-muted-foreground p-6">
            <p className="text-xs sm:text-sm">
              {emptyMessage || 'No image yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
