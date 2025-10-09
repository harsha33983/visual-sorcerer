import { useState } from 'react';
import * as React from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  json?: any;
}

interface ChatInterfaceProps {
  onEditRequest: (message: string) => void;
  onGenerateRequest?: (message: string) => void;
  messages: Message[];
  isProcessing?: boolean;
  initialPrompt?: string | null;
  onPromptApplied?: () => void;
}

export const ChatInterface = ({ 
  onEditRequest,
  onGenerateRequest, 
  messages, 
  isProcessing,
  initialPrompt,
  onPromptApplied 
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'edit' | 'generate'>('edit');

  // Apply initial prompt when it changes
  React.useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
      onPromptApplied?.();
    }
  }, [initialPrompt, onPromptApplied]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (mode === 'generate' && onGenerateRequest) {
      onGenerateRequest(input);
    } else {
      onEditRequest(input);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-lg border border-border">
      <div className="p-3 sm:p-4 border-b border-border flex items-center gap-2">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h2 className="font-semibold text-sm sm:text-base text-foreground">AI Photo Editor</h2>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8 sm:py-12">
              <p className="mb-2 text-sm sm:text-base">
                {mode === 'generate' ? 'Describe the image you want to generate' : 'Upload a photo and describe your edit'}
              </p>
              <p className="text-xs sm:text-sm mb-3 sm:mb-4">
                {mode === 'generate' 
                  ? 'Try: "A sunset over mountains" or "A cyberpunk city at night"'
                  : 'Try: "Remove background" or "Make it black and white"'}
              </p>
              <p className="text-xs text-muted-foreground/70">
                Powered by Gemini 2.5 Flash Image Preview
              </p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.json && (
                    <pre className="mt-2 p-2 bg-background/20 rounded text-xs overflow-x-auto">
                      {JSON.stringify(msg.json, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
              {isProcessing && idx === messages.length - 1 && msg.role === 'user' && (
                <div className="flex justify-start mt-2">
                  <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-secondary-foreground">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <p className="text-sm">Editing image...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 sm:p-4 border-t border-border space-y-2">
        {onGenerateRequest && (
          <div className="flex gap-2">
            <Button
              variant={mode === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('edit')}
              className="flex-1"
            >
              Edit Image
            </Button>
            <Button
              variant={mode === 'generate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('generate')}
              className="flex-1"
            >
              Generate Image
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'generate' 
              ? "Describe the image to generate..." 
              : "Describe your edit (e.g., make background white, enhance resolution...)"}
            className="resize-none bg-background/50 border-input text-sm"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            size="icon"
            className="shrink-0 bg-gradient-primary hover:opacity-90 transition-opacity h-auto w-10 sm:w-12"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
