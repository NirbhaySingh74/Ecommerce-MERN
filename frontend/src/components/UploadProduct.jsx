import { useState } from "react";
import { CgClose } from "react-icons/cg";
import toast from "react-hot-toast";
import axios from "axios";
import productCategory from "../helper/productCategory";
const apiurl = import.meta.env.VITE_API_URL;

const UploadProduct = ({ onClose, onProductUploaded }) => {
  const initialUserState = {
    productName: "",
    brandName: "",
    category: "",
    description: "",
    price: "",
    sellingPrice: "",
    images: [],
  };

  const [product, setProduct] = useState(initialUserState);
  const [previewUrls, setPreviewUrls] = useState([]);
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
      console.log(res);
      return res.data.secure_url;
    } catch (error) {
      console.error(
        "Image Upload Error: occur",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images" && files.length > 0) {
      const fileArray = Array.from(files);
      setProduct((prevProduct) => ({
        ...prevProduct,
        images: [...prevProduct.images, ...fileArray],
      }));

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevPreviews) => [...prevPreviews, ...previews]);
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !product.productName ||
      !product.brandName ||
      !product.category ||
      !product.description ||
      !product.price ||
      !product.sellingPrice
    ) {
      toast.error("All fields are required", { position: "top-right" });
      return;
    }

    setUploading(true);
    const imageUrls = [];
    for (const image of product.images) {
      const url = await handleImageUpload(image);
      if (url) {
        imageUrls.push(url);
      }
    }

    const productData = {
      ...product,
      images: imageUrls,
    };

    try {
      const response = await axios.post(
        `${apiurl}/api/add-product`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Product uploaded successfully", {
          position: "top-right",
        });
        setProduct(initialUserState);
        setPreviewUrls([]);
        onClose();
        onProductUploaded(); // Call the handler to refresh the product list
      } else {
        toast.error("Failed to upload product", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      // Extract the error message from the response
      const errorMessage =
        error.response?.data?.message || "Failed to upload product";

      toast.error(errorMessage, {
        position: "top-right",
      });
    } finally {
      setUploading(false);
    }
    // console.log(product);
  };

  // console.log(product);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl h-full max-h-[80%] overflow-auto shadow-xl transform transition-transform duration-200 scale-95 sm:scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl text-gray-800">Upload Product</h2>
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
              value={product.productName}
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
              value={product.brandName}
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
              value={product.category}
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
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
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
                value={product.price}
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
                value={product.sellingPrice}
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
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
