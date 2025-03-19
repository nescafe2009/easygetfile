import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NoteItem } from '@/types';

const NOTES_FILE = path.join(process.cwd(), 'data', 'notes.json');

// 确保数据目录存在
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 读取备忘数据列表
async function readNotes(): Promise<NoteItem[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(NOTES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 保存备忘数据列表
async function saveNotes(notes: NoteItem[]) {
  await ensureDataDir();
  await fs.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}

// GET 请求处理
export async function GET() {
  try {
    const notes = await readNotes();
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error reading notes:', error);
    return NextResponse.json(
      { error: 'Failed to read notes' },
      { status: 500 }
    );
  }
}

// POST 请求处理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, items } = body;

    if (!title || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Title and items array are required' },
        { status: 400 }
      );
    }

    const notes = await readNotes();
    const newNote: NoteItem = {
      id: uuidv4(),
      title,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    await saveNotes(notes);

    return NextResponse.json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

// PUT 请求处理 - 更新备忘录
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, items } = body;

    if (!id || !title || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'ID, title and items array are required' },
        { status: 400 }
      );
    }

    const notes = await readNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex === -1) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      items,
      updatedAt: new Date().toISOString(),
    };

    await saveNotes(notes);
    return NextResponse.json(notes[noteIndex]);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

// DELETE 请求处理
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

    const notes = await readNotes();
    const filteredNotes = notes.filter(note => note.id !== id);

    if (filteredNotes.length === notes.length) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    await saveNotes(filteredNotes);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
} 