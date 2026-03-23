import { create } from 'zustand';

interface BasketState {
  basketId: number | null;
  setBasketId: (id: number) => void;
  clearBasket: () => void;
}

export const useBasketStore = create<BasketState>((set) => ({
  basketId: null,
  setBasketId: (id) => set({ basketId: id }),
  clearBasket: () => set({ basketId: null }),
}));
