// React 애플리케이션의 진입점 파일
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// HTML의 root 엘리먼트를 가져옴
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// React 18의 새로운 Root API를 사용하여 애플리케이션 렌더링
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);