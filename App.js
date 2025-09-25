import React from 'react';
import { ToastProvider, ModalProvider } from './componentes/Alert';
import Navigation from './navigation/Navigation';

export default function App() {
  return (
    <ToastProvider>
      <ModalProvider>
        <Navigation />
      </ModalProvider>
    </ToastProvider>
  );
}