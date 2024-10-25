import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Footer from "./Components/Footer";
import Hero3D from "./Components/3dworld/Hero3D";

function App() {
  return (
    <Router>
      <div className="flex  min-h-100vh w-full overflow-x-hidden font-montserrat sm:pl-0 bg-gradient-to-br from-gray-100 to-gray-300">
        <div className="flex-grow flex-wrap">
          <Routes>
            <Route path="/" element={<Navigate to="/home/8651522113755" />} />
            <Route path="/home/:id" element={<Hero3D />} />
            <Route path="*" element={<Navigate to="/home/8651522113755" />} />
          </Routes>
        </div>
        <Footer className="hidden lg:block" />
      </div>
    </Router>
  );
}
export default App;
