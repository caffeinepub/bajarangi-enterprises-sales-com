import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface BusinessInfo {
    businessName: string;
    businessAddress: string;
    aboutText: string;
    contactEmail: string;
    contactPhone: string;
}
export type ProductId = string;
export interface AIPromptEntry {
    transformationDescriptor: string;
    promptText: string;
    timestamp: Time;
}
export interface UserProfile {
    name: string;
}
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, price: number, shortDescription: string, fullDescription: string, imageUrl: string): Promise<Product>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: ProductId): Promise<void>;
    getAllAIPromptEntries(): Promise<Array<AIPromptEntry>>;
    getAllProducts(): Promise<Array<Product>>;
    getBusinessInfo(): Promise<BusinessInfo>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(id: ProductId): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveAIPromptEntry(promptText: string, transformationDescriptor: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBusinessInfo(businessName: string, contactPhone: string, contactEmail: string, businessAddress: string, aboutText: string): Promise<BusinessInfo>;
    updateProduct(id: ProductId, name: string, price: number, shortDescription: string, fullDescription: string, imageUrl: string): Promise<Product>;
}
