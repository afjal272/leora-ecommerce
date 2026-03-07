"use client"

import { useState } from "react"
import { useProductStore } from "@/store/product.store"

interface Props {
  close: () => void
}

export default function AddProductModal({ close }: Props) {

  const { addProduct } = useProductStore()

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  })

  const [images, setImages] = useState<string[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

  }

  // IMAGE COMPRESSION FUNCTION

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {

      const reader = new FileReader()

      reader.onload = (event) => {

        const img = new Image()
        img.src = event.target?.result as string

        img.onload = () => {

          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          const MAX_WIDTH = 600
          const scale = MAX_WIDTH / img.width

          canvas.width = MAX_WIDTH
          canvas.height = img.height * scale

          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)

          const compressed = canvas.toDataURL("image/jpeg", 0.6)

          resolve(compressed)

        }

      }

      reader.readAsDataURL(file)

    })
  }

  // MULTIPLE IMAGE UPLOAD WITH COMPRESSION

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = e.target.files
    if (!files) return

    const compressedImages = await Promise.all(
      Array.from(files).map((file) => compressImage(file))
    )

    setImages((prev) => [...prev, ...compressedImages])

  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAdd = () => {

    if (!form.name || !form.price || images.length === 0) {
      alert("Name, price and at least one image required")
      return
    }

    const slug =
      form.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "") +
      "-" +
      Date.now()

    const productImages = [...images]

    addProduct({

      id: Date.now().toString(),
      slug,

      name: form.name,
      price: Number(form.price),

      description: form.description,
      category: form.category,

      stock: Number(form.stock) || 0,

      image: productImages[0],
      images: productImages

    })

    close()

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

          {/* IMAGE UPLOAD */}

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="border w-full p-2 rounded"
          />

          {/* IMAGE PREVIEW */}

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
            className="bg-black text-white px-4 py-2 rounded"
          >
            Save Product
          </button>

        </div>

      </div>

    </div>
  )
}