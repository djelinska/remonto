export interface Element {
  id: string;
  name: string;
  imageUrl?: string;
  status?: string;
  cost: number;
  quantity: number;
  location?: string;
  link?: string;
  note?: string;
  projectId: string;
}
