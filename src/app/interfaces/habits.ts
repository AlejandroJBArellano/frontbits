export interface IHabits {
  title: string;
  description: string;
  publicationIds: {
    type?: string | undefined;
    ref?: unknown;
  }[];
  userId?: string | undefined;
}
