import {Role} from './role';

export interface User {
  id?: number;
  email?: string;
  password?: string;
  provider?: string;
  fullName?: string;
  telephoneNumber?: string;
  avt?: string;
  checked?: boolean;
  roles?: [Role];
}
