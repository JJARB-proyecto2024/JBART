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
  status?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
}

export interface IBuyerUser {
  id?: number;
  name?: number;
  lastname?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
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