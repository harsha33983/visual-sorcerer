import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Sparkles, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptCard {
  category: string;
  prompts: string[];
  icon: string;
}

const predefinedPrompts: PromptCard[] = [
  {
    category: "Background",
    icon: "🎨",
    prompts: [
      "Remove background",
      "Replace background with white",
      "Make background transparent",
      "Add blur to background",
      "Change background to beach scene"
    ]
  },
  {
    category: "Color & Style",
    icon: "🌈",
    prompts: [
      "Make it black and white",
      "Apply sepia filter",
      "Increase saturation",
      "Add vintage style",
      "Apply cyberpunk style"
    ]
  },
  {
    category: "Enhancement",
    icon: "✨",
    prompts: [
      "Enhance resolution",
      "Sharpen the image",
      "Brighten the image",
      "Increase contrast",
      "Apply HDR effect"
    ]
  },
  {
    category: "Artistic",
    icon: "🎭",
    prompts: [
      "Make it look like a cartoon",
      "Convert to oil painting style",
      "Apply sketch effect",
      "Add watercolor effect",
      "Make it look like a comic book"
    ]
  },
  {
    category: "Professional",
    icon: "💼",
    prompts: [
      "Professional headshot enhancement",
      "Smooth skin and remove blemishes",
      "Perfect lighting for portrait",
      "Corporate photo style",
      "LinkedIn profile optimization"
    ]
  }
];

const Prompts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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

  const handlePromptClick = (prompt: string) => {
    localStorage.setItem('selectedPrompt', prompt);
    navigate('/');
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Editor</span>
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Predefined Prompts
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Choose from ready-made editing commands
              </p>
            </div>
          </div>
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
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-muted-foreground text-sm sm:text-base">
              Click any prompt to select it and return to the editor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {predefinedPrompts.map((category, idx) => (
              <Card
                key={idx}
                className="bg-card/80 backdrop-blur-sm border-border hover:shadow-card transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {category.prompts.length} prompts available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.prompts.map((prompt, pIdx) => (
                      <Button
                        key={pIdx}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-gradient-primary hover:text-primary-foreground transition-colors text-sm"
                        onClick={() => handlePromptClick(prompt)}
                      >
                        <span className="line-clamp-2">{prompt}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>Developed by Harshavardhan • Powered by AI</p>
        </div>
      </footer>
    </div>
  );
};

export default Prompts;
