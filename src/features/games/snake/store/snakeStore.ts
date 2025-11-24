import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SnakeState {
  score: number;
  highScore: number;
  setScore: (score: number) => void;
  resetScore: () => void;
  updateHighScore: (score: number) => void;
}

export const useSnakeStore = create<SnakeState>()(
  persist(
    (set) => ({
      score: 0,
      highScore: 0,
      setScore: (score) => set({ score }),
      resetScore: () => set({ score: 0 }),
      updateHighScore: (score) =>
        set((state) => ({
          highScore: score > state.highScore ? score : state.highScore,
        })),
    }),
    {
      name: 'snake-storage', // localStorage key
      partialize: (state) => ({
        highScore: state.highScore,
        // score is not persisted (resets each game session)
      }),
    }
  )
);

