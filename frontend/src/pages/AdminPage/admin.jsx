import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./admin.css";

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [currentProduct, setCurrentProduct] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image: null,
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/categories", {
        withCredentials: true,
      });
      setCategories(response.data);
      console.log("Catégories :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/products", {
        withCredentials: true,
      });
      setProducts(response.data);
      console.log("Produits :", response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  const openModal = (type, product = {}) => {
    setModalType(type);
    setCurrentProduct(product);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category_id: "",
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
    setCurrentProduct({ ...currentProduct, image: e.target.files[0] });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category_id", newProduct.category_id);
    formData.append("image", newProduct.image);

    try {
      const response = await axios.post(
        "http://localhost:4000/products/add-product",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.message);
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentProduct.name);
    formData.append("description", currentProduct.description);
    formData.append("price", currentProduct.price);
    formData.append("category_id", currentProduct.category_id);
    formData.append("image", currentProduct.image);

    try {
      const response = await axios.put(
        `http://localhost:4000/products/update-product/${currentProduct.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.message);
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit :", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/products/delete-product/${currentProduct.id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.message);
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  return (
    <div className="admin-page-container">
      <h2 className="admin-page-title">Admin Panel</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Catégorie</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.category_name}</td>
              <td>
                <img
                  src={`http://localhost:4000${product.image}`}
                  alt={product.name}
                  width="50"
                />
              </td>
              <td>
                <button
                  className="admin-edit-product-button"
                  onClick={() => openModal("edit", product)}
                >
                  Modifier
                </button>
                <button
                  className="admin-delete-product-button"
                  onClick={() => openModal("delete", product)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="admin-add-product-button"
        onClick={() => openModal("add")}
      >
        Ajouter un produit
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={
          modalType === "add" ? "modal-add-product" : "modal-delete-product"
        }
        overlayClassName="modal-overlay"
      >
        {modalType === "add" ? (
          <div>
            <h2>Ajouter un produit</h2>
            <form
              onSubmit={handleAddProduct}
              className="admin-product-add-form"
            >
              <div className="admin-product-add-form-article">
                <label>Nom</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="admin-product-add-form-article">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="admin-product-add-form-article">
                <label>Prix</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="admin-product-add-form-article">
                <label>Catégorie</label>
                <select
                  name="category_id"
                  value={newProduct.category_id}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-product-add-form-article">
                <label>Image</label>
                <input type="file" name="image" onChange={handleFileChange} />
              </div>
              <button type="submit">Ajouter</button>
              <button type="button" onClick={closeModal}>
                Annuler
              </button>
            </form>
          </div>
        ) : modalType === "edit" ? (
          <div>
            <h2>Modifier un produit</h2>
            <form
              onSubmit={handleUpdateProduct}
              className="admin-product-add-form"
            >
              <div className="admin-product-add-form-article">
                <label>Nom</label>
                <input
                  type="text"
                  name="name"
                  value={currentProduct.name}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="admin-product-add-form-article">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="admin-product-add-form-article">
                <label>Prix</label>
                <input
                  type="number"
                  name="price"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      price: e.target.value,
                    })
                  }
                />
              </div>
              <div className="admin-product-add-form-article">
                <label>Catégorie</label>
                <select
                  name="category_id"
                  value={currentProduct.category_id}
                  onChange={(e) =>
                    setCurrentProduct({
                      ...currentProduct,
                      category_id: e.target.value,
                    })
                  }
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="admin-product-add-form-article">
                <label>Image</label>
                <input type="file" name="image" onChange={handleFileChange} />
              </div>
              <button type="submit">Modifier</button>
              <button type="button" onClick={closeModal}>
                Annuler
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Supprimer un produit</h2>
            <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
            <button onClick={handleDeleteProduct}>Oui</button>
            <button onClick={closeModal}>Non</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPage;
