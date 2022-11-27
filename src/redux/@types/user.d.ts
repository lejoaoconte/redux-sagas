export interface UserType {
  id: string;
  login: string;
  password: string;
  avatarURL: string;
  name: string;
  telefone: string;
  email: string;
}

export interface UserState {
  user: UserType;
  loading: boolean;
  error: string;
}
