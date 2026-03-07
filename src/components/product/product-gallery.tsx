"use client"

import { useState } from "react"
import Image from "next/image"

interface Props {
  images: string[]
  name: string
}

export default function ProductGallery({ images, name }: Props) {

  const [activeImage, setActiveImage] = useState(images[0])

  return (
    <div className="flex gap-6">

      <div className="flex flex-col gap-3">

        {images.map((img, index) => (

          <div
            key={index}
            className="relative w-20 h-20 border rounded overflow-hidden cursor-pointer"
            onClick={() => setActiveImage(img)}
          >

            <Image
              src={img}
              alt={name}
              fill
              className="object-cover"
            />

          </div>

        ))}

      </div>

      <div className="relative w-[520px] h-[520px] bg-white rounded-2xl shadow-md overflow-hidden">

        <Image
          src={activeImage}
          alt={name}
          fill
          className="object-cover"
        />

      </div>

    </div>
  )
}