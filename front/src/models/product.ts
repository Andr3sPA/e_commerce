export type Size = "XS" | "S" | "M" | "L" | "XL";
export const sizesOrdered: Size[] = ["XS", "S", "M", "L", "XL"]
export const PATH_ID_MARKER = "-%"

export interface Product {
  id?: string,
  images: File[] | string[],
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
    images: [],
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

