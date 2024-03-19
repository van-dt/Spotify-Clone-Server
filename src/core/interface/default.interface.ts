import { ERole } from '@core/enum';

export interface IKeyRedisCache {
  RESOURCE: string;
  CUSTOMERS_BLOCKED: string | unknown;
}

export interface IPaginationQuery {
  page: number;
  take: number;
  skip: number;
  [key: string]: unknown;
}

export interface IPaginationResponse<T> {
  data: T;
  totalItems: number;
  page: number;
  totalPages: number;
  take: number;
}

export interface IUserData {
  uid: number;
  eml: string;
  rol: ERole[];
  tid: number;
  tco: string;
  fid: number;
  pid: number;
  firstName?: string;
  lastName?: string;
  firstNameFamily?: string;
  lastNameFamily?: string;
  [key: string]: unknown;
}

export interface IResponseAuthUser {
  id: number;
  email: string;
  roles: ERole[];
  templeId?: number;
  templeCode?: number;
  familyId?: number;
  publicUserId?: number;
  firstLogin?: number;
  firstName?: string;
  lastName?: string;
  firstNameFamily?: string;
  lastNameFamily?: string;
}

export interface IResponseAuth {
  user: IResponseAuthUser;
  token: string;
  refreshToken: string;
}

export interface IJwtPayload {
  uid?: string | number; //id account
  eml: string;
  rol?: ERole[];
  vid?: string; // id validationToken
  [key: string]: unknown;
}

export interface IResponseRefreshToken {
  token: string;
  refreshToken: string;
}
