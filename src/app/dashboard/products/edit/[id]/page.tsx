import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth-helper';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import EditProductClient from './EditProductClient';

async function getProduct(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) {
    return null;
  }
  return {
    ...product,
    _id: product._id.toString(),
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || (session.user as any)?.role !== 'admin') {
    redirect('/login');
  }

  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    redirect('/dashboard');
  }

  return <EditProductClient product={product} />;
}

