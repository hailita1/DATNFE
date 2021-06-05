import {Role} from './role';

export interface UserToken {
  id?: number;
  email?: string;
  password?: string;
  name?: string;
  telephoneNumber?: string;
  avt?: string;
  roles?: [Role];
  accessToken?: string;
}
