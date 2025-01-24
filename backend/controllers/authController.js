const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const signup = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors du hachage du mot de passe" });
    }

    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')";

    db.query(query, [username, email, hash], (err, result) => {
      if (err) {
        console.error(
          "Erreur lors de l'insertion de l'utilisateur : " + err.stack
        );
        return res
          .status(500)
          .json({ message: "Erreur lors de l'insertion de l'utilisateur" });
      }

      res.status(201).json({
        message: "Utilisateur ajouté avec succès",
        userId: result.insertId,
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur : " + err.stack
      );
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération de l'utilisateur" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erreur lors de la vérification du mot de passe" });
      }

      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email ou mot de passe incorrect" });
      }

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Connexion réussie",
        token,
      });
    });
  });
};

module.exports = { signup, login };
