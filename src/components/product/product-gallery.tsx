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
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">

      {/* MAIN IMAGE */}

      <div className="order-1 md:order-2 relative w-full md:w-[520px] h-[420px] md:h-[520px] bg-white rounded-2xl shadow-md overflow-hidden">

        <Image
          src={activeImage}
          alt={name}
          fill
          className="object-cover"
        />

      </div>

      {/* THUMBNAILS */}

      <div className="order-2 md:order-1 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible">

        {images.map((img, index) => (

          <div
            key={index}
            className="relative min-w-[70px] h-[70px] md:w-20 md:h-20 border rounded overflow-hidden cursor-pointer flex-shrink-0"
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

    </div>
  )
}