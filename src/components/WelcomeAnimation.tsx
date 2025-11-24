import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export const WelcomeAnimation = ({ onComplete }: WelcomeAnimationProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background animate-fade-out">
      <div className="text-center space-y-6 animate-scale-in">
        <div className="flex justify-center items-center gap-4 mb-8 animate-fade-in">
          <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-primary animate-pulse" />
          <h2 className="text-5xl sm:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Photo Editor
          </h2>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl animate-pulse"></div>
          <p className="relative text-xl sm:text-2xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Craft Your Vision with AI
          </p>
        </div>
        <div className="flex justify-center gap-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};
