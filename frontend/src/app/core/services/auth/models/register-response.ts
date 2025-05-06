import { UserDto } from '../../../../shared/models/user.dto';

export interface RegisterResponse {
  message: string;
  user: UserDto;
}
