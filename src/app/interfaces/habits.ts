export interface IHabit {
  title: string;
  description: string;
  publicationIds: {
    type?: string | undefined;
    ref?: unknown;
  }[];
  userId?: string | undefined;
  _id?: string | undefined;
}
