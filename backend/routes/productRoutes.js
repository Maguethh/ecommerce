const express = require("express");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsPaginated,
  getProductById,
} = require("../controllers/productController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getProducts);
router.post(
  "/add-product",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addProduct
);
router.put(
  "/update-product/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateProduct
);
router.delete(
  "/delete-product/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);
router.get("/paginated", getProductsPaginated);
router.get("/:id", getProductById);

module.exports = router;
