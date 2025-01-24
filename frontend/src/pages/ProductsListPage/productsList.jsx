import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../../components/ProductCardComponent/productCard";
import "./productsList.css";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setProducts([]); // reset liste des produits quand la catégorie change
    setPage(1); // reset page quand la catégorie change
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/categories", {
        withCredentials: true,
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/products/paginated",
        {
          params: { page, category_id: category },
          withCredentials: true,
        }
      );
      setProducts((prevProducts) => {
        // remplace la liste des produits si on est sur la 1ere page
        if (page === 1) {
          return response.data;
        }
        // sinn ajoute les produits à la liste
        return [...prevProducts, ...response.data];
      });
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="products-page-container">
      <h2 className="products-page-title">Products</h2>
      <div className="products-filter">
        <label>Filter by Category:</label>
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            category_name={product.category_name}
          />
        ))}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ProductsList;
