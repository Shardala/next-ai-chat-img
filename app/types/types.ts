
export type UserRole = 'user' | 'assistant';

export interface Role {
  tag: UserRole;
  name: string;
}

export type Message = {
  role: Role,
  content: string,
  date: string
}

