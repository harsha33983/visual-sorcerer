import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { User, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  full_name: string;
  email: string;
  avatar_url: string | null;
}

interface EditHistory {
  id: string;
  prompt: string;
  created_at: string;
}

export const UserProfile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<EditHistory[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchHistory();

    // Listen for history updates
    const handleHistoryUpdate = () => {
      fetchHistory();
    };

    window.addEventListener('edit-history-updated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('edit-history-updated', handleHistoryUpdate);
    };
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('full_name, email, avatar_url')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('edit_history')
      .select('id, prompt, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setHistory(data);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    const { error } = await supabase
      .from('edit_history')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete history item",
        variant: "destructive",
      });
      return;
    }

    setHistory(history.filter(item => item.id !== id));
    toast({
      title: "Deleted",
      description: "History item removed",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-gradient-primary">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
              {profile?.full_name ? getInitials(profile.full_name) : <User className="w-6 h-6" />}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{profile?.full_name || 'User'}</CardTitle>
            <CardDescription className="text-xs">{profile?.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Recent Edits</h3>
        </div>
        
        <ScrollArea className="h-[300px] pr-4">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No edit history yet
            </p>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2 mb-1">
                      {item.prompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8"
                    onClick={() => deleteHistoryItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
