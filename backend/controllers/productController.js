const db = require("../db");
const path = require("path");
const fs = require("fs");

const getProducts = (req, res) => {
  const query = `
    SELECT products.id, products.name, products.description, products.price, products.image, categories.name AS category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des produits : " + err.stack
      );
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des produits" });
    }

    res.status(200).json(results);
  });
};

const getProductsPaginated = (req, res) => {
  const { page = 1, limit = 9, category_id } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT products.id, products.name, products.description, products.price, products.image, categories.name AS category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
  `;

  if (category_id) {
    query += ` WHERE products.category_id = ${db.escape(category_id)}`;
  }

  query += ` LIMIT ${db.escape(parseInt(limit))} OFFSET ${db.escape(
    parseInt(offset)
  )}`;

  db.query(query, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des produits : " + err.stack
      );
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des produits" });
    }

    res.status(200).json(results);
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT products.id, products.name, products.description, products.price, products.image, categories.name AS category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
    WHERE products.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du produit : " + err.stack);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération du produit" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json(results[0]);
  });
};

const addProduct = (req, res) => {
  const { name, description, price, category_id } = req.body;
  const user_id = req.user.userId;
  const image = req.file ? `/uploads/images/${req.file.filename}` : null;

  if (!name || !price || !category_id || !image) {
    return res
      .status(400)
      .json({ message: "Tous les champs obligatoires doivent être remplis" });
  }

  const query =
    "INSERT INTO products (name, description, price, category_id, user_id, image) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [name, description, price, category_id, user_id, image],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'ajout du produit : " + err.stack);
        return res
          .status(500)
          .json({ message: "Erreur lors de l'ajout du produit" });
      }

      res.status(201).json({
        message: "Produit ajouté avec succès",
        productId: result.insertId,
      });
    }
  );
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, category_id } = req.body;
  const image = req.file
    ? `/uploads/images/${req.file.filename}`
    : req.body.image;

  if (!name || !price || !category_id || !image) {
    return res
      .status(400)
      .json({ message: "Tous les champs obligatoires doivent être remplis" });
  }

  // supr l'ancienne image quand la nouvelle est dl
  if (req.file) {
    const query = "SELECT image FROM products WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error(
          "Erreur lors de la récupération de l'image : " + err.stack
        );
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération de l'image" });
      }

      const oldImage = results[0].image;
      if (oldImage) {
        const oldImagePath = path.join(__dirname, "..", oldImage);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(
              "Erreur lors de la suppression de l'ancienne image : " + err.stack
            );
          }
        });
      }
    });
  }

  const query =
    "UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image = ? WHERE id = ?";

  db.query(
    query,
    [name, description, price, category_id, image, id],
    (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la mise à jour du produit : " + err.stack
        );
        return res
          .status(500)
          .json({ message: "Erreur lors de la mise à jour du produit" });
      }

      res.status(200).json({ message: "Produit mis à jour avec succès" });
    }
  );
};

const deleteProduct = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "L'ID du produit est requis" });
  }

  // supr l'image du projket
  const query = "SELECT image FROM products WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'image : " + err.stack);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'image" });
    }

    const image = results[0].image;
    if (image) {
      const imagePath = path.join(__dirname, "..", image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(
            "Erreur lors de la suppression de l'image : " + err.stack
          );
        }
      });
    }

    const deleteQuery = "DELETE FROM products WHERE id = ?";
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de la suppression du produit : " + err.stack
        );
        return res
          .status(500)
          .json({ message: "Erreur lors de la suppression du produit" });
      }

      res.status(200).json({ message: "Produit supprimé avec succès" });
    });
  });
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsPaginated,
  getProductById,
};
