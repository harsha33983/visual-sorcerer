import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'pixaris_favorite_prompts';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (promptTitle: string) => {
    setFavorites(prev => {
      if (prev.includes(promptTitle)) return prev;
      return [...prev, promptTitle];
    });
  };

  const removeFavorite = (promptTitle: string) => {
    setFavorites(prev => prev.filter(title => title !== promptTitle));
  };

  const toggleFavorite = (promptTitle: string) => {
    if (favorites.includes(promptTitle)) {
      removeFavorite(promptTitle);
    } else {
      addFavorite(promptTitle);
    }
  };

  const isFavorite = (promptTitle: string) => favorites.includes(promptTitle);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
