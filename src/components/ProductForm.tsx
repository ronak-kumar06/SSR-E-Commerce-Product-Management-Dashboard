'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormInput } from '@/lib/validations';
import Image from 'next/image';
import ClientOnly from './ClientOnly';

interface ProductFormProps {
  initialData?: Partial<ProductFormInput & { _id?: string; imagePublicId?: string }>;
  onSubmit: (data: ProductFormInput & { imagePublicId?: string }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [uploading, setUploading] = useState(false);
  const [imagePublicId, setImagePublicId] = useState<string | undefined>(
    initialData?.imagePublicId
  );
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 0,
      imageUrl: '',
    },
    mode: 'onBlur',
  });

  const watchedImageUrl = watch('imageUrl');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error || 'Failed to upload image';
        const errorDetails = error.details ? `\n\nDetails: ${error.details}` : '';
        
        // Show detailed error message
        alert(`${errorMessage}${errorDetails}\n\nPlease check your Cloudinary configuration in .env.local`);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Verify we got a valid URL
      if (!data.url || !data.publicId) {
        throw new Error('Invalid response from upload server');
      }

      // Verify it's not a placeholder/dummy image
      if (data.url.includes('picsum.photos') || data.url.includes('placeholder')) {
        throw new Error('Image upload service not properly configured. Please set up Cloudinary.');
      }

      setValue('imageUrl', data.url);
      setImagePublicId(data.publicId);
      setImagePreview(data.url);
    } catch (error: any) {
      console.error('Image upload error:', error);
      // Don't set preview if upload failed
      setImagePreview(null);
      setValue('imageUrl', '');
      setImagePublicId(undefined);
    } finally {
      setUploading(false);
    }
  };

  const validateStep = async (stepNumber: number): Promise<boolean> => {
    let fieldsToValidate: (keyof ProductFormInput)[] = [];

    switch (stepNumber) {
      case 1:
        fieldsToValidate = ['name', 'description'];
        break;
      case 2:
        fieldsToValidate = ['price', 'category', 'stock'];
        break;
      case 3:
        fieldsToValidate = ['imageUrl'];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid && step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onFormSubmit = async (data: ProductFormInput) => {
    await onSubmit({ ...data, imagePublicId });
  };

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center">Loading form...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">
            {initialData?._id ? 'Edit Product' : 'Create New Product'}
          </h2>
          <span className="text-sm text-gray-500">
            Step {step} of 3
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <ClientOnly>
        <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                {...register('name')}
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Pricing & Inventory */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Pricing & Inventory</h3>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                id="price"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                {...register('category')}
                type="text"
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Electronics, Clothing, Books"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                {...register('stock', { valueAsNumber: true })}
                type="number"
                id="stock"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Product Image */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Product Image</h3>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Product Image *
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {uploading && (
                <p className="mt-1 text-sm text-blue-600">Uploading image...</p>
              )}
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
              )}
              {!watchedImageUrl && (
                <p className="mt-1 text-sm text-red-600">Please upload an image</p>
              )}
            </div>

            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-64 border border-gray-300 rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Previous
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!watchedImageUrl || uploading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {initialData?._id ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        )}
        </form>
      </ClientOnly>
    </div>
  );
}

