import express from "express";
import { userSignUpController } from "../controllers/user/userSignUp.js";
import { upload } from "../middleware/multer.middleware.js";
import { userSignInController } from "../controllers/user/userSignIn.js";
import { userDetail } from "../controllers/user/userDetail.js";
import { authToken } from "../middleware/authToken.js";
import { userLogout } from "../controllers/user/userLogout.js";
import { allUser } from "../controllers/user/allUser.js";
import { editRole } from "../controllers/user/editRole.js";
import { addProduct } from "../controllers/Product/addProduct.js";
import { allProduct } from "../controllers/Product/allProduct.js";
import { checkAdmin } from "../middleware/checkAdmin.js";
import { updateProduct } from "../controllers/Product/updateProduct.js";
import { getCategoryProduct } from "../controllers/Product/getProductCategory.js";
import { getCategoryWiseProduct } from "../controllers/Product/getCategoryWiseProduct.js";
import { getSingleProductDetail } from "../controllers/Product/getSingleProductDetail.js";
import { addToCart } from "../controllers/user/addToCart.js";
import { removeToCart } from "../controllers/user/removeToCart.js";
import { countAddToCartProduct } from "../controllers/user/countAddToCartProduct.js";
import { getProductById } from "../controllers/Product/getProductById.js";
import { addToCartViewProduct } from "../controllers/user/addToCartViewProduct.js";
import { updateAddToCart } from "../controllers/user/updateAddToCartProduct.js";
import { deleteAddToCartProduct } from "../controllers/user/deleteAddToCartProduct.js";
import { searchProduct } from "../controllers/Product/searchProduct.js";
import { filterProduct } from "../controllers/Product/filterProduct.js";

const router = express.Router();

router.post("/sign-up", upload.single("profilePic"), userSignUpController);
router.post("/login", userSignInController);
router.get("/user-details", authToken, userDetail);
router.get("/logout", userLogout);

//Admin Pannel
router.get("/allusers", allUser);
router.put("/users/:id", editRole);

//product
router.post("/add-product", authToken, checkAdmin, addProduct);
router.get("/products", allProduct);
router.put("/products/:id", authToken, checkAdmin, updateProduct);
router.get("/get-categoryProduct", getCategoryProduct);
router.get("/category/:categoryName", getCategoryWiseProduct);
router.get("/product/:id", getSingleProductDetail);
router.get("/search", searchProduct);
router.post("/filter-product", filterProduct);

// user add to cart
router.post("/addtocart", authToken, addToCart);
router.post("/removefromcart", authToken, removeToCart); // Add this line
router.get("/countAddToCartProduct", authToken, countAddToCartProduct);
router.get("/getproduct/:productId", getProductById);
router.get("/view-cart-product", authToken, addToCartViewProduct);
router.post("/update-cart-product", authToken, updateAddToCart);
router.delete("/delete-cart-product", authToken, deleteAddToCartProduct);
export default router;
