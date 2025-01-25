export type Size = "XS" | "S" | "M" | "L" | "XL";
export const sizesOrdered: Size[] = ["XS", "S", "M", "L", "XL"]

export interface Product {
  imgUrl: string,
  name: string,
  description: string,
  category: string,
  materials: string,
  price: number,
  size: Size
  inStock: number,
}

export const products: Product[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    name: "Classic Denim Jacket",
    description: "A timeless denim jacket for casual outings.",
    category: "Jackets",
    materials: "100% Cotton",
    price: 59.99,
    size: "L",
    inStock: 60,
  },
  {
    imgUrl: "https://m.media-amazon.com/images/I/61dExu1GuhL._AC_UY1000_.jpg",
    name: "Cotton T-Shirt",
    description: "Soft and comfortable cotton t-shirt.",
    category: "T-Shirts",
    materials: "100% Organic Cotton",
    price: 19.99,
    size: "M",
    inStock: 60,
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    name: "Running Sneakers",
    description: "Perfect for daily runs or casual wear.",
    category: "Shoes",
    materials: "Mesh, Rubber",
    price: 79.99,
    size: "L",
    inStock: 30,
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    name: "Running Sneakers",
    description: "Perfect for daily runs or casual wear.",
    category: "Shoes",
    materials: "Mesh, Rubber",
    price: 79.99,
    size: "L",
    inStock: 30,
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    name: "Running Sneakers",
    description: "Perfect for daily runs or casual wear.",
    category: "Shoes",
    materials: "Mesh, Rubber",
    price: 79.99,
    size: "S",
    inStock: 30,
  },
  {
    imgUrl: "https://m.media-amazon.com/images/I/61dExu1GuhL._AC_UY1000_.jpg",
    name: "Running Sneakers",
    description: "Perfect for daily runs or casual wear.",
    category: "Shoes",
    materials: "Mesh, Rubber",
    price: 79.99,
    size: "XS",
    inStock: 30,
  },
];
