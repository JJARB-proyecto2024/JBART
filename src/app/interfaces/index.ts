export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  name?: string;
  lastname?: string;
  picture?: string;
  genre?: string;
  deliveryLocation?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
}

export interface IBrandUser {
  id?: number;
  legalId?: number;
  logoType?: string;
  brandName?: string;
  legalRepresentativeName?: string;
  mainLocationAddress?: string;
  legalDocuments?: string;
  brandCategories?: string;
  rate?: number;
  status?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole;
}

export interface IBuyerUser {
  id?: number;
  name?: number;
  lastname?: string;
  status?: string;
  email?: string;
  password?: string;
  deliveryLocation?: string;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  role?: IRole;
}

export interface IOtp {
  id?: number;
  otpCode: string;
  email: string;
  expiryTime: Date;
}

export interface IPayment {
  intent: string;
  method: string;
  transactions: any[];
}

export interface IItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ICategory {
  id?: number;
  name: string;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface IProduct {
  id?: number;
  name?: string;
  price?: number;
  quantityInStock?: number;
  picture?: string;
  status?: string;
  rate?: number;
  category?: ICategory;
  userBrand?: IBrandUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrder {
  id?: number;
  product?: IProduct;
  userBuyer?: IBuyerUser;
  shippingAddress?: string;
  status?: string;
  createdAt?: string;
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRoleType {
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN_ROLE'
}

export enum IRole {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  userBrand = "ROLE_USER_BRAND",
  superAdmin = 'ROLE_SUPER_ADMIN'
}