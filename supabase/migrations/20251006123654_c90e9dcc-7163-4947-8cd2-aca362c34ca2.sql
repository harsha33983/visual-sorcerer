-- Create edit_history table to store user's edit requests
CREATE TABLE public.edit_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  edited_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.edit_history ENABLE ROW LEVEL SECURITY;

-- Create policies for edit_history table
CREATE POLICY "Users can view their own edit history"
  ON public.edit_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own edit history"
  ON public.edit_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own edit history"
  ON public.edit_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_edit_history_user_id ON public.edit_history(user_id);
CREATE INDEX idx_edit_history_created_at ON public.edit_history(created_at DESC);