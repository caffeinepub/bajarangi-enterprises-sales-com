import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ProductId = string;
export interface Product {
    id: ProductId;
    name: string;
    createdAt: bigint;
    updatedAt: bigint;
    imageUrl: string;
    shortDescription: string;
    fullDescription: string;
    price: number;
}
export interface BusinessInfo {
    businessName: string;
    businessAddress: string;
    aboutText: string;
    contactEmail: string;
    contactPhone: string;
}
export interface backendInterface {
    addProduct(name: string, price: number, shortDescription: string, fullDescription: string, imageUrl: string): Promise<Product>;
    deleteProduct(id: ProductId): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getBusinessInfo(): Promise<BusinessInfo>;
    getProduct(id: ProductId): Promise<Product>;
    isAdmin(checkedPrincipal: Principal): Promise<boolean>;
    updateBusinessInfo(businessName: string, contactPhone: string, contactEmail: string, businessAddress: string, aboutText: string): Promise<BusinessInfo>;
    updateProduct(id: ProductId, name: string, price: number, shortDescription: string, fullDescription: string, imageUrl: string): Promise<Product>;
}
