"use client"

import { useState } from "react"
import { useProductStore } from "../../../store/product.store"

interface Props {
  close: () => void
  onSuccess?: () => void
}

export default function AddProductModal({ close, onSuccess }: Props) {

  const { addProduct } = useProductStore()

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // 🔥 FIX: remove /api duplication
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 🔥 IMAGE COMPRESS
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {

      const reader = new FileReader()

      reader.onload = (event) => {

        const img = new Image()
        img.src = event.target?.result as string

        img.onload = () => {

          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          const MAX_WIDTH = 800
          const scale = Math.min(1, MAX_WIDTH / img.width)

          canvas.width = img.width * scale
          canvas.height = img.height * scale

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

          const compressed = canvas.toDataURL("image/jpeg", 0.6)

          resolve(compressed)
        }
      }

      reader.readAsDataURL(file)
    })
  }

  // ✅ ADD THIS (missing function)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const compressedImages: string[] = []

    for (let i = 0; i < files.length; i++) {
      const compressed = await compressImage(files[i])
      compressedImages.push(compressed)
    }

    setImages((prev) => [...prev, ...compressedImages])
  }

  // ✅ ADD THIS (remove button fix)
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAdd = async () => {

    if (!localStorage.getItem("token")) {
      alert("Login required")
      return
    }

    if (!form.name || !form.price || images.length === 0) {
      alert("Name, price and at least one image required")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${API_URL}/products`, { // ✅ FIXED
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          description: form.description,
          category: form.category,
          stock: Number(form.stock) || 0,
          images: images,
        }),
      })

      if (!res.ok) {
        throw new Error("Unauthorized or server error")
      }

      const data = await res.json()

      if (!data || !data.success || !data.data) {
        throw new Error(data?.message || "Invalid server response")
      }

      const product = data.data

      addProduct({
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        stock: product.stock,
        image: product.image,
        images: product.images,
      })

      onSuccess?.()
      close()

    } catch (error: any) {
      alert(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-[520px] max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-semibold mb-6">
          Add Product
        </h2>

        <div className="space-y-4">

          <input
            name="name"
            placeholder="Product Name"
            className="border w-full p-2 rounded"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            className="border w-full p-2 rounded"
            value={form.price}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            className="border w-full p-2 rounded"
            value={form.description}
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category"
            className="border w-full p-2 rounded"
            value={form.category}
            onChange={handleChange}
          />

          <input
            name="stock"
            type="number"
            placeholder="Stock Quantity"
            className="border w-full p-2 rounded"
            value={form.stock}
            onChange={handleChange}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="border w-full p-2 rounded"
          />

          {images.length > 0 && (
            <div className="flex flex-wrap gap-4">

              {images.map((img, index) => (
                <div key={index} className="relative">

                  <img
                    src={img}
                    alt="preview"
                    className="h-24 w-24 object-cover rounded"
                  />

                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full"
                  >
                    ✕
                  </button>

                </div>
              ))}

            </div>
          )}

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={close}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

        </div>

      </div>

    </div>
  )
}