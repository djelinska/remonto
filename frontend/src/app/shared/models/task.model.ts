export interface Task {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  startTime?: string;
  endTime?: string;
  priority?: string;
  cost: number;
  note?: string;
  projectId: string;
}
