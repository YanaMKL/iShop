/**
 * Interfaces
 */

interface Category {
    id:number,
    name:string
}

interface Product {
    id:number,
    name:string,
    price:number,
    category_id:number,
    image_name:string,
    qty?: number
}

interface Cart {
    id?: number,
    createTime?: any,
    customerId?: any,
    products: any[],
    total?: number
}

interface User {
    id?: number,
    fullName?: string,
    email?: string,
    role?: string
}