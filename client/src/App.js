import React from "react";
import "./App.css";
import "../src/assets/styles/css/main.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";

import Navbar from "./components/NavBar/Navbar";
import HomePage from "./components/HomePage/HomePage";
import FavoritesPage from "./components/FavoritesPage/FavoritesPage";

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </Container>
      </div>
    </BrowserRouter>
  );
}

export default App;
