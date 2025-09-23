export interface Person {
  id: string;
  fullName: string;
  birthDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePersonInput = {
  fullName: string;
  birthDate?: string;
  notes?: string;
};

export type UpdatePersonInput = {
  id: string;
  fullName?: string;
  birthDate?: string;
  notes?: string;
};
