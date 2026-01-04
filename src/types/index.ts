export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  imageFile?: File;
}

export interface ChartData {
  name: string;
  value: number;
}

