export type Size = "XS" | "S" | "M" | "L" | "XL";
export const sizesOrdered: Size[] = ["XS", "S", "M", "L", "XL"]

export interface Product {
  image: File[] | null,
  imgUrl?: string,
  name: string,
  reference: string,
  color: string,
  description: string,
  material: string,
  price: number,
  size: Size | string,
}

export function emptyProduct() {
  const emptyP: Product = {
    image: null,
    name: "",
    reference: "",
    color: "",
    description: "",
    material: "",
    price: 0,
    size: "",
  }

  return emptyP
}

