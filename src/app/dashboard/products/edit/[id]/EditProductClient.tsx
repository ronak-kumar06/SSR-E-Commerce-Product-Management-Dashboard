'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProductForm from '@/components/ProductForm';
import { ProductFormInput } from '@/lib/validations';
import { IProduct } from '@/models/Product';

async function updateProduct(
  id: string,
  data: ProductFormInput & { imagePublicId?: string }
) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update product');
  }

  return response.json();
}

interface EditProductClientProps {
  product: IProduct;
}

export default function EditProductClient({ product }: EditProductClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ProductFormInput & { imagePublicId?: string }) =>
      updateProduct(product._id.toString(), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/dashboard');
    },
  });

  const handleSubmit = async (data: ProductFormInput & { imagePublicId?: string }) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProductForm
        initialData={{
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          imageUrl: product.imageUrl,
          _id: product._id.toString(),
          imagePublicId: product.imagePublicId,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard')}
      />
    </div>
  );
}

