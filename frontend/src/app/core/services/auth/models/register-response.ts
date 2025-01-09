import { User } from '../../../../shared/models/user';

export interface RegisterResponse {
  message: string;
  user: User;
}
