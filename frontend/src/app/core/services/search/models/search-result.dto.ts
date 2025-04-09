export interface SearchResultDto {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  type: 'task' | 'material' | 'tool';
  projectOrderKey?: string;
}
