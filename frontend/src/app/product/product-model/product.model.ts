import { integer } from "../../shared/integer";

export interface Product {
    id: integer;
    name: string;
    description: string;
    price: number;
    stock: integer;
    images: string[];
}
