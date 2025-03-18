import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NoteItem } from '@/types';

const NOTES_FILE = path.join(process.cwd(), 'src', 'data', 'notes.json');

// 确保笔记文件存在
async function ensureNotesFile() {
  try {
    await fs.access(NOTES_FILE);
  } catch (error) {
    await fs.mkdir(path.dirname(NOTES_FILE), { recursive: true });
    await fs.writeFile(NOTES_FILE, JSON.stringify([]));
  }
}

// 读取所有笔记
async function readNotes(): Promise<NoteItem[]> {
  await ensureNotesFile();
  const data = await fs.readFile(NOTES_FILE, 'utf-8');
  return JSON.parse(data);
}

// 写入所有笔记
async function writeNotes(notes: NoteItem[]) {
  await ensureNotesFile();
  await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}

// 获取所有笔记
export async function GET() {
  try {
    const notes = await readNotes();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error getting notes:', error);
    return NextResponse.json(
      { error: 'Failed to get notes' },
      { status: 500 }
    );
  }
}

// 创建新笔记
export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }
    
    const notes = await readNotes();
    const newNote: NoteItem = {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    await writeNotes(notes);
    
    return NextResponse.json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

// 删除笔记
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Note ID is required' },
        { status: 400 }
      );
    }
    
    let notes = await readNotes();
    notes = notes.filter(note => note.id !== id);
    await writeNotes(notes);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 