const db = require("../db");

const getCategories = (req, res) => {
  const query = "SELECT * FROM categories";

  db.query(query, (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération des catégories : " + err.stack
      );
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des catégories" });
    }

    res.status(200).json(results);
  });
};

module.exports = { getCategories };
