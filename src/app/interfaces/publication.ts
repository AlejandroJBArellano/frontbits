export interface IPublication {
  createdAt?: string;
  customProperties: { key: string; value: string }[];
  description: string;
  habitId: string;
  rate: number;
  title: string;
  updatedAt?: string;
  userId: string;
  _id: string;
  urlImg?: string;
}
