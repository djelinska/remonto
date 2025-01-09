import { User } from '../../../../shared/models/user';

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}
