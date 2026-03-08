import { useState, useEffect, useRef } from "react";

interface ProcessingLoaderProps {
  isProcessing: boolean;
}

export const ProcessingLoader = ({ isProcessing }: ProcessingLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      setElapsedTime(0);
      startTimeRef.current = Date.now();

      const tick = () => {
        if (!startTimeRef.current) return;
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setElapsedTime(elapsed);

        // Asymptotic curve: fast start, slows toward 95%
        const pct = Math.min(95, 95 * (1 - Math.exp(-elapsed / 12)));
        setProgress(Math.round(pct));

        animationRef.current = requestAnimationFrame(tick);
      };

      animationRef.current = requestAnimationFrame(tick);
    } else {
      // Snap to 100% briefly before hiding
      if (startTimeRef.current) {
        setProgress(100);
        setTimeout(() => {
          setProgress(0);
          setElapsedTime(0);
          startTimeRef.current = null;
        }, 400);
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isProcessing]);

  if (!isProcessing && progress === 0) return null;

  const circumference = 2 * Math.PI * 45;
  const strokeOffset = circumference - (progress / 100) * circumference;

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border p-8 shadow-elegant max-w-sm w-full mx-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-2xl animate-pulse" />

            <div className="relative w-36 h-36 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-muted/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  className="transition-[stroke-dashoffset] duration-300 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Percentage in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Processing Image
            </h3>
            <p className="text-sm text-muted-foreground">
              AI is working its magic... {formatTime(elapsedTime)}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
