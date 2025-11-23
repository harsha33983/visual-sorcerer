import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  image: string | null;
  title: string;
}

export const ImagePreviewDialog = ({ isOpen, onClose, onAccept, image, title }: ImagePreviewDialogProps) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center justify-center min-h-[400px] max-h-[60vh] rounded-lg bg-secondary/20 overflow-auto p-4">
          {image ? (
            <img
              src={image}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No image to preview</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Discard
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button
            onClick={onAccept}
            className="bg-gradient-primary hover:opacity-90 gap-2"
          >
            <Check className="w-4 h-4" />
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
