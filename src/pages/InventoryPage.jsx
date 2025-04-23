import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { addProduct, getProducts } from "../firestore/products";
import LoggedInHeader from "../components/LoggedInHeader";
import { calculatePrice } from "../utils";

export default function InventoryPage() {
  const { user } = useAuth();
  const [Products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    buyPrice: "",
    quantity: "",
    margin: 0.3,
  });
  const [overridePrice, setOverridePrice] = useState(null);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);

  const override =
    overridePrice === null || overridePrice.trim() === ""
      ? null
      : parseFloat(overridePrice);

  const finalPrice =
    override !== null
      ? override
      : calculatePrice(parseFloat(newProduct.buyPrice), newProduct.margin);

      const handleAdd = async () => {
        if (!newProduct.name || !newProduct.quantity) return;
      
        const quantity = parseInt(newProduct.quantity);
        const buyPrice = parseFloat(newProduct.buyPrice);
      
        const shouldUsePrice = !isNaN(buyPrice) || override !== null;
      
        const priceToUse = override !== null
          ? override
          : isNaN(buyPrice)
            ? null
            : calculatePrice(buyPrice, newProduct.margin);
      
        const productData = {
          name: newProduct.name,
          quantity,
          storeId: user.uid,
          createdBy: user.uid,
        };
      
        if (shouldUsePrice && priceToUse !== null) {
          productData.price = priceToUse;
          productData.purchasePrice = buyPrice;
        }
      
        await addProduct(productData);
      
        setNewProduct({ name: "", buyPrice: "", quantity: "", margin: 0.3 });
        setOverridePrice(null);
        loadProducts();
      };
      

  const loadProducts = async () => {
    const fetched = await getProducts();
    setProducts(fetched);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  function renderProductRow(product) {
    return (
      <tr key={product.id}>
        <td className="border px-4 py-2">{product.name}</td>
        <td className="border px-4 py-2">${product.price.toFixed(2)}</td>
        <td className={`border px-4 py-2 ${product.quantity<lowStockThreshold ? 'text-red-500 font-bold' : ''}`}
        >{product.quantity}</td>
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
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Buy Price"
          value={newProduct.buyPrice}
          onChange={(e) => {
            setNewProduct({ ...newProduct, buyPrice: e.target.value });
            setOverridePrice(null); 
          }}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) =>
            setNewProduct({ ...newProduct, quantity: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Margin (e.g. 0.3)"
          value={newProduct.margin}
          onChange={(e) =>
            setNewProduct({ ...newProduct, margin: parseFloat(e.target.value) })
          }
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add Product
        </button>

        <input
          type="number"
          placeholder="Final Price"
          value={
            overridePrice !== null
              ? overridePrice
              : !isNaN(parseFloat(newProduct.buyPrice)) &&
                !isNaN(parseFloat(newProduct.margin))
              ? calculatePrice(parseFloat(newProduct.buyPrice), parseFloat(newProduct.margin)).toFixed(2)
              : ""
          }
          onChange={(e) => setOverridePrice(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      
      <div className="w-4/5 mx-auto text-right">
        <label>Low Stock Threshold
          <input  type="number" className="border p-2 rounded w-20" value={lowStockThreshold} 
          onChange={(e)=> setLowStockThreshold(parseInt(e.target.value)||0)}/>   
          </label>
      </div>
    
      <table className="w-4/5 mx-auto border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>{Products.map(renderProductRow)}</tbody>
      </table>
    </div>
  );
}
