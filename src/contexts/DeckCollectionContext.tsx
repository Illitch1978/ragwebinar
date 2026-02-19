import { createContext, useContext, useState, ReactNode } from "react";

export type DeckItemType = "quote" | "finding" | "metric" | "chart" | "insight" | "summary";

export interface DeckItem {
  id: string;
  type: DeckItemType;
  source: "cockpit" | "explore" | "overview";
  title: string;
  content: string;
  metadata?: Record<string, string>;
  addedAt: string;
}

interface DeckCollectionContextType {
  items: DeckItem[];
  addItem: (item: Omit<DeckItem, "id" | "addedAt">) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  hasItem: (content: string) => boolean;
}

const DeckCollectionContext = createContext<DeckCollectionContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearAll: () => {},
  hasItem: () => false,
});

export const useDeckCollection = () => useContext(DeckCollectionContext);

export const DeckCollectionProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<DeckItem[]>([]);

  const addItem = (item: Omit<DeckItem, "id" | "addedAt">) => {
    const newItem: DeckItem = {
      ...item,
      id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      addedAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearAll = () => setItems([]);

  const hasItem = (content: string) =>
    items.some(i => i.content === content);

  return (
    <DeckCollectionContext.Provider value={{ items, addItem, removeItem, clearAll, hasItem }}>
      {children}
    </DeckCollectionContext.Provider>
  );
};
