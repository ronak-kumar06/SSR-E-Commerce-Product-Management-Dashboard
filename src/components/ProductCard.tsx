'use client';

import Image from 'next/image';
import { IProduct } from '@/models/Product';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductCardProps {
  product: IProduct;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.imageUrl);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      onDelete(product._id.toString());
    }
  };

  const handleImageError = () => {
    // If image fails to load, show placeholder
    setImageError(true);
  };

  // Check if image URL is a placeholder/dummy image
  const isPlaceholderImage = imageSrc.includes('picsum.photos') || 
                            imageSrc.includes('placeholder') ||
                            imageSrc.startsWith('dummy-');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full bg-gray-200">
        {!imageError && imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            onError={handleImageError}
            unoptimized={isPlaceholderImage} // Don't optimize placeholder images
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {isPlaceholderImage && !imageError && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            Placeholder
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-indigo-600">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
          <span className="text-xs text-gray-500">Sales: {product.sales}</span>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

