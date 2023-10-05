import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from "react";

// Define the shape of your item
interface Item {
  id: number;
  name: string;
  // Add other properties as needed
}

// Define the type for the context
interface ItemContextType {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (itemId: number) => void;
}

// Create the context
const ItemContext = createContext<ItemContextType | undefined>(undefined);

// Define the actions (reducer types and actions)
type Action =
  | { type: "ADD_ITEM"; payload: Item }
  | { type: "REMOVE_ITEM"; payload: number };

const itemReducer = (state: Item[], action: Action): Item[] => {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, action.payload];
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
};

// Create the context provider
interface ItemProviderProps {
  children: ReactNode;
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {
  const [items, dispatch] = useReducer(itemReducer, []);

  const addItem = (item: Item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (itemId: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  return (
    <ItemContext.Provider value={{ items, addItem, removeItem }}>
      {children}
    </ItemContext.Provider>
  );
};

// Create a custom hook for accessing the context
export const useItemContext = (): ItemContextType => {
  const context = useContext(ItemContext);
  if (context === undefined) {
    throw new Error("useItemContext must be used within an ItemProvider");
  }
  return context;
};
