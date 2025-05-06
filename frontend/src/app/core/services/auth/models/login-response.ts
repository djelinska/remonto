import { UserDto } from '../../../../shared/models/user.dto';

export interface LoginResponse {
  message: string;
  user: UserDto;
  token: string;
}
