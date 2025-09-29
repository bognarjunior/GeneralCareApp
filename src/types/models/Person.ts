export interface Person {
  id: string;
  fullName: string;
  birthDate?: string;
  notes?: string;
  avatarUri?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePersonInput = {
  fullName: string;
  birthDate?: string;
  notes?: string;
  avatarUri?: string;
};

export type UpdatePersonInput = {
  id: string;
  fullName?: string;
  birthDate?: string;
  notes?: string;
  avatarUri?: string;
};
