/** @format */

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Footer from "./Components/Footer";
import Hero3D from "./Components/3dworld/Hero3D";
import ShopifyCollection from "./Components/products/ShopifyProduts";

function App() {
  return (
    <Router>
      <div className="font-montserrat sm:pl-0 "> 
        <Routes>
          <Route path="/" element={<Navigate to="/home/1" />} />
          <Route path="/home/:id" element={<Hero3D />} />
          <Route path="*" element={<Navigate to="/home/1" />} />
        </Routes>
        <ShopifyCollection />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
