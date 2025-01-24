import React from "react";
import { Link } from "react-router-dom";
import "./productCard.css";

const ProductCard = ({ id, image, name, price, category_name }) => {
  return (
    <Link to={`/products/${id}`} className="product-card">
      <img
        src={`http://localhost:4000${image}`}
        alt={name}
        className="product-card-image"
      />
      <h3 className="product-card-name">{name}</h3>
      <p className="product-card-price">{price} €</p>
      <p className="product-card-category">{category_name}</p>
    </Link>
  );
};

export default ProductCard;
