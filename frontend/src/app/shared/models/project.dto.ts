export interface ProjectDto {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  budget: number;
  imageUrls?: string[];
  notes?: ProjectNoteDto[];
}

export interface ProjectNoteDto {
  _id: string;
  content: string;
  createdAt: string;
}
