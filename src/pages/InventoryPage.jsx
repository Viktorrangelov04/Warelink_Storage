import { useAuth } from "../context/AuthContext"
import {auth} from "../firebaseConfig"
import { useEffect, useState } from "react"
import {
  deleteProduct,
  updateProduct,
  addProduct,
  getProducts,
  fetchMargin,
} from "../firestore/products"
import LoggedInHeader from "../components/LoggedInHeader"
import { calculatePrice } from "../utils"
import { getCategoriesByStoreId } from "../firestore/categories"

export default function InventoryPage() {
  const { user } = useAuth()
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  
  const [overridePrice, setOverridePrice] = useState(null)
  const [lowStockThreshold, setLowStockThreshold] = useState(5)
  const [editProduct, setEditProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [margin, setMargin] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    buyPrice: "",
    quantity: "",
    margin: margin || "",
  })

  useEffect(() => {
    async function loadMargin() {
      const defaultMargin = await fetchMargin();
      setMargin(defaultMargin);
      setNewProduct((prev) => ({
        ...prev,
        margin: defaultMargin,
      }));
    }
    loadMargin();
  }, []);

  const override =
    overridePrice === null || overridePrice.trim() === ""
      ? null
      : parseFloat(overridePrice)

  const finalPrice =
    override !== null
      ? override
      : calculatePrice(parseFloat(newProduct.buyPrice), newProduct.margin)

  async function loadProducts() {
    const fetched = await getProducts()
    setAllProducts(fetched)
  }

  async function loadCategories() {
    const fetchedCategories = await getCategoriesByStoreId(user.uid)
    setCategories(fetchedCategories.map((c) => c.name))
  }

  useEffect(() => {
    if (user?.uid) {
      loadProducts()
      loadCategories()
    }
  }, [user?.uid])

  useEffect(() => {
    let result = allProducts

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(term)
      )
    }

    setFilteredProducts(result)
  }, [allProducts, searchTerm, selectedCategory])

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.quantity) return

    const quantity = parseInt(newProduct.quantity)
    const buyPrice = parseFloat(newProduct.buyPrice)
    const shouldUsePrice = !isNaN(buyPrice) || override !== null
    const priceToUse =
      override !== null
        ? override
        : isNaN(buyPrice)
        ? null
        : calculatePrice(buyPrice, newProduct.margin)

    const productData = {
      name: newProduct.name,
      quantity,
      storeId: user.uid,
      createdBy: user.uid,
    }

    if (shouldUsePrice && priceToUse !== null) {
      productData.price = priceToUse
      productData.purchasePrice = buyPrice
    }

    await addProduct(productData)
    setNewProduct({ name: "", buyPrice: "", quantity: "", margin: margin ?? 0.3 })
    setOverridePrice(null)
    loadProducts()
  }

  function handleDelete(productId) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId).then(loadProducts)
    }
  }

  function openEditModal(product) {
    setEditProduct({ ...product, quantityToAdd: 0 })
  }

  function renderProductRow(product) {
    return (
      <tr key={product.id}>
        <td className="border px-4 py-2">{product.name}</td>
        <td className="border py-2 text-center">
          ${product.price.toFixed(2)}
        </td>
        <td
          className={`border py-2 text-center ${
            product.quantity < lowStockThreshold
              ? "bg-red-500 font-bold"
              : ""
          }`}
        >
          {product.quantity}
        </td>
        <td className="border px-4 py-2 text-center">
          <button
            onClick={() => openEditModal(product)}
            className="mr-2"
          >
            ✎
          </button>
          <button onClick={() => handleDelete(product.id)}>🗑</button>
        </td>
      </tr>
    )
  }

  return (
    <>
      <LoggedInHeader />
      <h1 className="text-2xl font-bold text-center mb-4">Inventory</h1>

      <div className="w-4/5 mx-auto mb-4 flex justify-center items-center gap-2">
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
            setNewProduct({ ...newProduct, buyPrice: e.target.value })
            setOverridePrice(null)
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
            setNewProduct({
              ...newProduct,
              margin: parseFloat(e.target.value),
            })
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
            override !== null
              ? override
              : !isNaN(parseFloat(newProduct.buyPrice)) &&
                !isNaN(newProduct.margin)
              ? finalPrice.toFixed(2)
              : ""
          }
          onChange={(e) => setOverridePrice(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="w-3/5 mx-auto mb-4 flex justify-between items-center">
        <label>
          Low Stock Threshold
          <input
            type="number"
            className="w-16 h-8 text-center border p-2 ml-2 rounded"
            value={lowStockThreshold}
            onChange={(e) =>
              setLowStockThreshold(parseInt(e.target.value) || 0)
            }
          />
        </label>

        <label className="flex items-center">
          <span>Search:</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products…"
            className="ml-2 border p-2 rounded"
          />
        </label>
        <label className="ml-4">
          Filter by Category
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="ml-2 border p-2 rounded"
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table className="w-3/5 mx-auto border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border py-2">Quantity</th>
            <th className="border py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(renderProductRow)}
        </tbody>
      </table>

      {editProduct && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white border border-black p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              className="border p-2 rounded w-full mb-2"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  price: parseFloat(e.target.value),
                })
              }
              placeholder="Sell Price"
            />
            <input
              type="number"
              className="border p-2 rounded w-full mb-2"
              placeholder="Add Quantity"
              value={editProduct.quantityToAdd}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  quantityToAdd: parseInt(e.target.value) || 0,
                })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={async () => {
                  const updated = {
                    ...editProduct,
                    quantity:
                      editProduct.quantity + (editProduct.quantityToAdd || 0),
                  }
                  delete updated.quantityToAdd
                  await updateProduct(updated)
                  setEditProduct(null)
                  loadProducts()
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
