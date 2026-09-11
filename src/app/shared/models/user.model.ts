export interface User {
  id: number;
  name: string;
  surname: string;
  avatar?: string | null;
}

export interface CreateUserPayload {
  name: string;
  surname: string;
  avatar?: string | null;
  password: string;
}

export interface LoginPayload {
  name: string;
  surname: string;
  password: string;
}
