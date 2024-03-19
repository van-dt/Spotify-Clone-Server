import { ERole } from '@core/enum';
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

// export interface IResponseAuth {
//   token: string;
// }

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
