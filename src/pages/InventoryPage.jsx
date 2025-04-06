import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { addProduct, getProducts } from "../firestore/products";
import LoggedInHeader from "../components/LoggedInHeader";

export default function InventoryPage() {
  const { user } = useAuth();
  const [Products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", quantity: "" });

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) return;

    await addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      createdBy: user.uid,
      storeId: user.uid
    });

    setNewProduct({ name: "", price: "", quantity: "" });
    loadProducts();
  };

  const loadProducts = async () => {
    const fetched = await getProducts();
    setProducts(fetched);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  function handleNameChange(e){
    setNewProduct({ ...newProduct, name: e.target.value });
  };

  function handlePriceChange(e){
    setNewProduct({ ...newProduct, price: e.target.value });
  };

  function handleQuantityChange(e){
    setNewProduct({ ...newProduct, quantity: e.target.value });
  };

  function renderProductRow(product) {
    return (
      <tr key={product.id}>
        <td className="border px-4 py-2">{product.name}</td>
        <td className="border px-4 py-2">${product.price.toFixed(2)}</td>
        <td className="border px-4 py-2">{product.quantity}</td>
      </tr>
    );
  }

  return (
    <div>
      <LoggedInHeader />
      <h1 className="text-2xl font-bold text-center mb-4">Inventory</h1>

      <div className="w-4/5 mx-auto mb-4 flex justify-center items-center gap-2 ">
        <input
          type="text"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleNameChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={handlePriceChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={handleQuantityChange}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      <table className="w-4/5 mx-auto border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Products.map(renderProductRow)}
        </tbody>
      </table>
    </div>
  );
}
