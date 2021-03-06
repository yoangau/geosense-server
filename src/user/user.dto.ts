import { User } from './user.entity';

export interface UserAddDTO {
  name: string;
  color: string;
}

export interface UserDTO {
  user: User;
  token: string;
}

export interface JWTPayload {
  user: User;
}

export interface UserIdDTO {
  userId: string;
}
