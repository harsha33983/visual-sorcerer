import { useCallback } from 'react';
import { Upload, Image as ImageIcon, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (file: File, preview: string) => void;
  uploadedImage: string | null;
  isEdited?: boolean;
}

export const ImageUpload = ({ onImageUpload, uploadedImage, isEdited }: ImageUploadProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    if (!uploadedImage) return;
    
    const link = document.createElement('a');
    link.href = uploadedImage;
    link.download = `edited-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your edited photo is being downloaded!",
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(file, event.target.result as string);
          toast({
            title: "Image uploaded",
            description: "Your photo is ready for editing!",
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
    }
  }, [onImageUpload, toast]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageUpload(file, event.target.result as string);
          toast({
            title: "Image uploaded",
            description: "Your photo is ready for editing!",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      {!uploadedImage ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full h-full min-h-[400px] border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary transition-colors bg-card/50 backdrop-blur-sm"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <div className="p-6 rounded-full bg-gradient-primary">
            <Upload className="w-12 h-12 text-primary-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Upload Your Photo</h3>
            <p className="text-muted-foreground">
              Drag & drop or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Supports: JPG, PNG, WebP
            </p>
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative max-w-full max-h-full rounded-lg overflow-hidden shadow-card">
            <img
              src={uploadedImage}
              alt="Uploaded preview"
              className="max-w-full max-h-[600px] object-contain"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => document.getElementById('file-input')?.click()}
                className="p-3 bg-secondary/90 backdrop-blur-sm rounded-lg hover:bg-secondary transition-colors"
              >
                <ImageIcon className="w-5 h-5 text-secondary-foreground" />
              </button>
              {isEdited && (
                <Button
                  onClick={handleDownload}
                  className="p-3 bg-gradient-primary hover:opacity-90"
                  size="icon"
                >
                  <Download className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
