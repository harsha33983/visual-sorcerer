import { useEffect, useState } from 'react';

interface ProcessingLoaderProps {
  isProcessing: boolean;
}

export const ProcessingLoader = ({ isProcessing }: ProcessingLoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isProcessing) {
      setProgress(0);
      return;
    }

    // Simulate progress from 0 to 95% (last 5% waits for actual completion)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        // Slower progress as we get closer to 95%
        const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 2 : 1;
        return Math.min(prev + increment, 95);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    // Complete to 100% when processing finishes
    if (!isProcessing && progress > 0) {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
  }, [isProcessing, progress]);

  if (!isProcessing && progress === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border p-8 shadow-elegant max-w-sm w-full mx-4">
        <div className="text-center space-y-6">
          <div className="relative">
            {/* Animated gradient ring */}
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-2xl animate-pulse"></div>
            
            {/* Progress circle */}
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted/20"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                  className="transition-all duration-300 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Processing Image
            </h3>
            <p className="text-sm text-muted-foreground">
              AI is working its magic...
            </p>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
