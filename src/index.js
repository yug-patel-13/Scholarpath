import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import global_en from './components/en/global.json';
import global_guj from './components/guj/global.json';
import global_hn from './components/hn/global.json';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';

i18next.init({
  interpolation: { escapeValue: false },
  lng: savedLanguage, // Use saved language or default to 'en'
  fallbackLng: 'en',
  resources: {
    en: { global: global_en },
    guj: { global: global_guj },
    hn: { global: global_hn }
  },
});

// Save language preference when changed
i18next.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
    <App />
    </I18nextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
