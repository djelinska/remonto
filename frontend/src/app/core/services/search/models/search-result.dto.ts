export interface SearchResultDto {
  name: string;
  projectId: string;
  projectName: string;
  type: 'task' | 'material' | 'tool';
}
