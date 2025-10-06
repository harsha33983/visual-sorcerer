import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { ImageUpload } from '@/components/ImageUpload';
import { ChatInterface } from '@/components/ChatInterface';
import { UserProfile } from '@/components/UserProfile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut, BookOpen } from 'lucide-react';

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
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

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

  useEffect(() => {
    // Check for selected prompt from prompts page
    const storedPrompt = localStorage.getItem('selectedPrompt');
    if (storedPrompt) {
      setSelectedPrompt(storedPrompt);
      localStorage.removeItem('selectedPrompt');
      
      toast({
        title: "Prompt loaded!",
        description: "The prompt has been added to the editor",
      });
    }
  }, [toast]);

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

    if (!session?.user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to edit images",
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
        
        // Save to history
        await supabase.from('edit_history').insert({
          user_id: session.user.id,
          prompt: message,
          image_url: uploadedImage,
          edited_image_url: data.editedImage
        });

        const assistantMsg: Message = {
          role: 'assistant',
          content: `✓ Image edited: "${message}"`,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        toast({
          title: "Image edited successfully",
          description: "Your edited image is ready!",
        });

        // Trigger refresh of history
        window.dispatchEvent(new Event('edit-history-updated'));
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
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Photo Editor
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Upload, edit, and transform your photos with AI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/prompts')}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Prompts</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* User Profile - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <UserProfile />
          </div>

          {/* Image Upload/Preview */}
          <div className="lg:col-span-1 bg-card/30 backdrop-blur-sm rounded-lg border border-border p-3 sm:p-4 shadow-card">
            <ImageUpload
              onImageUpload={handleImageUpload}
              uploadedImage={editedImage || uploadedImage}
              isEdited={!!editedImage}
            />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-1 h-[500px] sm:h-[600px] lg:h-auto">
            <ChatInterface
              onEditRequest={handleEditRequest}
              messages={messages}
              isProcessing={isProcessing}
              initialPrompt={selectedPrompt}
              onPromptApplied={() => setSelectedPrompt(null)}
            />
          </div>

          {/* User Profile - Shown on mobile/tablet at bottom */}
          <div className="lg:hidden">
            <UserProfile />
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
