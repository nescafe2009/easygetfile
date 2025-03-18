export interface FileItem {
  id: string;
  name: string;
  path: string;
  size: number;
  createdAt: string;
  type: string;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface NoteItem {
  id: string;
  title: string;
  items: KeyValuePair[];
  createdAt: string;
  updatedAt: string;
} 