import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { ImageUpload } from '@/components/ImageUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  json?: any;
}

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (!session) {
    return null;
  }

  const handleImageUpload = (file: File, preview: string) => {
    setCurrentFile(file);
    setUploadedImage(preview);
    setEditedImage(null);
    setMessages([]);
  };

  const parseEditRequest = (request: string): any => {
    const lowerRequest = request.toLowerCase();
    const tasks: any[] = [];

    // Background operations
    if (lowerRequest.includes('remove background')) {
      tasks.push({ action: 'remove_background' });
    }
    if (lowerRequest.includes('white background') || lowerRequest.includes('background white')) {
      tasks.push({ action: 'remove_background' });
      tasks.push({ action: 'replace_background', value: 'white' });
    }
    if (lowerRequest.includes('transparent background')) {
      tasks.push({ action: 'remove_background' });
    }

    // Color operations
    if (lowerRequest.includes('black and white') || lowerRequest.includes('grayscale')) {
      tasks.push({ action: 'apply_filter', filter: 'grayscale' });
    }
    if (lowerRequest.includes('sepia') || lowerRequest.includes('vintage')) {
      tasks.push({ action: 'apply_filter', filter: 'sepia' });
    }

    // Enhancement operations
    if (lowerRequest.includes('enhance') || lowerRequest.includes('upscale') || lowerRequest.includes('improve resolution')) {
      tasks.push({ action: 'upscale', value: '2x' });
    }
    if (lowerRequest.includes('sharpen')) {
      tasks.push({ action: 'sharpen' });
    }
    if (lowerRequest.includes('blur')) {
      tasks.push({ action: 'blur' });
    }
    if (lowerRequest.includes('brighten') || lowerRequest.includes('brighter')) {
      tasks.push({ action: 'adjust_brightness', value: 20 });
    }
    if (lowerRequest.includes('darken') || lowerRequest.includes('darker')) {
      tasks.push({ action: 'adjust_brightness', value: -20 });
    }
    if (lowerRequest.includes('increase contrast')) {
      tasks.push({ action: 'adjust_contrast', value: 20 });
    }
    if (lowerRequest.includes('saturation')) {
      tasks.push({ action: 'adjust_saturation', value: 20 });
    }

    // Style operations
    if (lowerRequest.includes('cartoon')) {
      tasks.push({ action: 'apply_style', style: 'cartoon' });
    }
    if (lowerRequest.includes('oil painting')) {
      tasks.push({ action: 'apply_style', style: 'oil_painting' });
    }
    if (lowerRequest.includes('sketch')) {
      tasks.push({ action: 'apply_style', style: 'sketch' });
    }
    if (lowerRequest.includes('cyberpunk')) {
      tasks.push({ action: 'apply_style', style: 'cyberpunk' });
    }
    if (lowerRequest.includes('hdr')) {
      tasks.push({ action: 'apply_filter', filter: 'hdr' });
    }

    // Retouching operations
    if (lowerRequest.includes('smooth skin') || lowerRequest.includes('beauty mode')) {
      tasks.push({ action: 'retouch_skin' });
    }
    if (lowerRequest.includes('remove blemish')) {
      tasks.push({ action: 'remove_blemishes' });
    }

    if (tasks.length === 0) {
      tasks.push({ 
        action: 'custom_prompt', 
        description: request 
      });
    }

    return { edit_tasks: tasks };
  };

  const handleEditRequest = async (message: string) => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    const userMsg: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // Call the edge function with the image and instruction
      const { data, error } = await supabase.functions.invoke('edit-image', {
        body: {
          imageData: uploadedImage,
          instruction: message
        }
      });

      if (error) throw error;

      if (data?.editedImage) {
        setEditedImage(data.editedImage);
        
        const assistantMsg: Message = {
          role: 'assistant',
          content: `✓ Image edited: "${message}"`,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        toast({
          title: "Image edited successfully",
          description: "Your edited image is ready!",
        });
      }
    } catch (error: any) {
      console.error('Error editing image:', error);
      
      let errorMessage = 'Failed to edit image';
      if (error.message?.includes('Rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message?.includes('Payment required')) {
        errorMessage = 'Please add credits to your Lovable AI workspace.';
      }

      const errorMsg: Message = {
        role: 'assistant',
        content: `✗ Error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorMsg]);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Photo Editor
            </h1>
            <p className="text-sm text-muted-foreground">
              Upload, edit, and transform your photos with AI
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 h-full">
          {/* Left Panel - Image Upload/Preview */}
          <div className="bg-card/30 backdrop-blur-sm rounded-lg border border-border p-4 shadow-card">
            <ImageUpload
              onImageUpload={handleImageUpload}
              uploadedImage={editedImage || uploadedImage}
              isEdited={!!editedImage}
            />
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="h-[600px] lg:h-auto">
            <ChatInterface
              onEditRequest={handleEditRequest}
              messages={messages}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by AI • Transform your photos with natural language</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
