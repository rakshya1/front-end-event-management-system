import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const STORAGE_KEY = 'ems_cart_v1';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // {id, eventId, eventTitle, ticketName, price, quantity, image, date, time, location, organizer}
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setItems(parsed.items || []);
        setPromoCode(parsed.promoCode || '');
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, promoCode }));
  }, [items, promoCode]);

  const addItem = (payload) => {
    // payload: { eventId, eventTitle, ticketName, price, quantity, image, date, time, location, organizer }
    const key = `${payload.eventId}_${payload.ticketName}`;
    setItems((prev) => {
      const idx = prev.findIndex(i => i.key === key);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: Math.min(999, updated[idx].quantity + payload.quantity) };
        return updated;
      }
      return [...prev, { ...payload, key, id: Date.now() }];
    });
  };

  const updateQuantity = (key, quantity) => {
    setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i));
  };

  const removeItem = (key) => {
    setItems(prev => prev.filter(i => i.key !== key));
  }; 

  const clearCart = () => setItems([]);

  const serviceFeeRate = 0.05; // 5% per item
  const vatRate = 0.13; // 13% on subtotal + service fee

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);
  const serviceFee = useMemo(() => Math.round(subtotal * serviceFeeRate), [subtotal]);
  const vat = useMemo(() => Math.round((subtotal + serviceFee) * vatRate), [subtotal, serviceFee]);

  const discount = useMemo(() => {
    if (promoCode.toUpperCase() === 'SAVE10') return Math.round(subtotal * 0.10);
    if (promoCode.toUpperCase() === 'NEPAL5') return Math.round(subtotal * 0.05);
    return 0;
  }, [promoCode, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal + serviceFee + vat - discount), [subtotal, serviceFee, vat, discount]);

  const applyPromo = (code) => setPromoCode(code);

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    promoCode,
    applyPromo,
    breakdown: { subtotal, serviceFee, vat, discount, total, serviceFeeRate, vatRate }
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};