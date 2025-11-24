import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TicTacToeState {
  score: { player1: number; player2: number };
  updateScore: (player: 'player1' | 'player2') => void;
  resetScore: () => void;
}

export const useTicTacToeStore = create<TicTacToeState>()(
  persist(
    (set) => ({
      score: { player1: 0, player2: 0 },
      updateScore: (player) =>
        set((state) => ({
          score: {
            ...state.score,
            [player]: state.score[player] + 1,
          },
        })),
      resetScore: () =>
        set({
          score: { player1: 0, player2: 0 },
        }),
    }),
    {
      name: 'tictactoe-storage', // localStorage key
    }
  )
);

