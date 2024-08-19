import { useState } from "react";
import { CgClose } from "react-icons/cg";
import axios from "axios";
import PropTypes from "prop-types";
import productCategory from "../helper/productCategory";
import { IoIosCloseCircle } from "react-icons/io";
import toast from "react-hot-toast";
const apiurl = import.meta.env.VITE_API_URL;

const EditProducts = ({ product, onClose, onProductUploaded }) => {
  const [productDetails, setProductDetails] = useState({
    productName: product.productName || "",
    brandName: product.brandName || "",
    category: product.category || "",
    description: product.description || "",
    price: product.price || "",
    sellingPrice: product.sellingPrice || "",
    images: product.images || [],
  });
  const [previewUrls, setPreviewUrls] = useState(product.images || []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (image) => {
    const cloudinaryUploadPreset = "mern_product";

    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", cloudinaryUploadPreset);

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnwgwq672/image/upload",
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      console.error(
        "Image Upload Error:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map((file) => handleImageUpload(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      const validUrls = uploadedUrls.filter((url) => url !== null);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        images: [...prevDetails.images, ...validUrls],
      }));
      setPreviewUrls((prevUrls) => [...prevUrls, ...validUrls]);
    } else {
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...productDetails.images];
    const newPreviewUrls = [...previewUrls];
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      images: newImages,
    }));
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const imageUrls = [];
    for (const image of productDetails.images) {
      const url = await handleImageUpload(image);
      if (url) {
        imageUrls.push(url);
      }
    }

    const productData = {
      ...productDetails,
      images: imageUrls,
    };
    console.log(productData);
    console.log(product._id);
    try {
      const response = await axios.put(
        `${apiurl}/api/products/${product._id}`,
        productData
      );
      console.log(response.data);
      toast.success(response?.data?.message, { position: "top-right" });
      onProductUploaded();
      onClose();
      console.log("get called");
    } catch (error) {
      console.error("Error updating product:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to upload product";

      toast.error(errorMessage, {
        position: "top-right",
      });
    } finally {
      setUploading(false);
    }
    // console.log(productDetails);
    // console.log(product._id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl h-full max-h-[80%] overflow-auto shadow-xl transform transition-transform duration-200 scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl text-gray-800">Edit Product</h2>
          <div
            className="text-2xl text-gray-600 hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="productName"
              value={productDetails.productName}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              value={productDetails.brandName}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter brand name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={productDetails.category}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Category</option>
              {productCategory.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <input
              type="file"
              name="images"
              onChange={handleChange}
              multiple
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 -mt-2 -mr-2 text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <IoIosCloseCircle size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={productDetails.description}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter product description"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={productDetails.price}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter price"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">
                Selling Price
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={productDetails.sellingPrice}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter selling price"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                uploading ? "cursor-not-allowed" : ""
              }`}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditProducts.propTypes = {
  product: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onProductUploaded: PropTypes.func.isRequired,
};

export default EditProducts;
