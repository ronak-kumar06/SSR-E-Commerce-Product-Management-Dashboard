'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProductForm from '@/components/ProductForm';
import { ProductFormInput } from '@/lib/validations';

async function createProduct(data: ProductFormInput & { imagePublicId?: string }) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }

  return response.json();
}

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/dashboard');
    },
  });

  const handleSubmit = async (data: ProductFormInput & { imagePublicId?: string }) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      // Error handling is done in the form component
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/dashboard')}
      />
    </div>
  );
}

