export interface Element {
  id: number;
  name: string;
  imageUrl?: string;
  status?: string;
  cost: number;
  quantity: number;
  location?: string;
  link?: string;
  note?: string;
  projectId: number;
}
