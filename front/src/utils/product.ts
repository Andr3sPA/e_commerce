import { Product } from "../models/product";

export function mapKeys(obj: any): Product {
  const p: Product = {
    image: null, //TODO: change to a list
    imgUrl: obj.Images[0],
    name: obj.Name,
    reference: obj.Reference,
    color: obj.Color,
    description: obj.Description,
    material: obj.Material,
    price: obj.Price,
    size: obj.Size
  }

  return p
}
