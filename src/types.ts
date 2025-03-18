export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: string;
  type: string;
}

export interface NoteItem {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
} 