'use client';
import { useState, useCallback, createContext } from 'react';

export const ToastContext = createContext(null);

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback(
    (message, options = {}) => addToast({ type: 'success', message, ...options }),
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => addToast({ type: 'error', message, duration: 7000, ...options }),
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => addToast({ type: 'warning', message, ...options }),
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => addToast({ type: 'info', message, ...options }),
    [addToast]
  );

  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}