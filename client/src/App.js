import "./style/App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accommodation from "./components/Accommodation";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/accommodations/:id?" element={<Accommodation />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
