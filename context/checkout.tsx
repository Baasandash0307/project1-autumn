import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CheckoutLine = {
  name: string;
  quantity: number;
  price: number;
};

type CheckoutContextValue = {
  lines: CheckoutLine[];
  total: number;
  settledId: number;
  beginCheckout: (lines: CheckoutLine[]) => void;
  completeCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CheckoutLine[]>([]);
  const [settledId, setSettledId] = useState(0);

  const beginCheckout = useCallback((nextLines: CheckoutLine[]) => {
    setLines(nextLines);
  }, []);

  const completeCheckout = useCallback(() => {
    setLines([]);
    setSettledId((value) => value + 1);
  }, []);

  const total = lines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );

  const value = useMemo(
    () => ({ lines, total, settledId, beginCheckout, completeCheckout }),
    [lines, total, settledId, beginCheckout, completeCheckout],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }

  return context;
}
