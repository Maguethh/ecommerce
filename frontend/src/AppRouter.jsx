import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/home.jsx";
import LoginPage from "./pages/LoginPage/login.jsx";
import SignupPage from "./pages/SignupPage/signup.jsx";
import AdminPage from "./pages/AdminPage/admin.jsx";
import Header from "./components/HeaderComponent/header.jsx";
import ProductsList from "./pages/ProductsListPage/productsList.jsx";
import ProductDetail from "./pages/ProductDetailPage/productDetail.jsx";
const AppRouter = () => {
  console.log("AppRouter rendered");
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
