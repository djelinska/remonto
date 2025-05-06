import { UserType } from '../enums/user-type';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: UserType;
}
