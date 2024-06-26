import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';

const AppRoutes = () => (
  <Router>
    <Routes>
         <Route path="/" element={<App />}>
        <Route index element={<App />} />
        <Route path=":roomId" element={<App />} />
        </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
