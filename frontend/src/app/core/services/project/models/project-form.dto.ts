export interface ProjectFormDto {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  budget: number;
  imageUrls: string[];
}
