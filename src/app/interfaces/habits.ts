import { IPublication } from "./publication";
export interface IHabit {
  title: string;
  description: string;
  publicationIds:
    | {
        type?: string | undefined;
        ref?: unknown;
      }
    | IPublication[];
  userId?: string | undefined;
  _id?: string | undefined;
  createdAt?: string;
  urlImg?: string;
}
