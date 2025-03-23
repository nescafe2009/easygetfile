import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
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

// POST 请求处理 - 导入备忘数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notes: importedNotes } = body;
    
    // 验证导入数据
    if (!importedNotes || !Array.isArray(importedNotes)) {
      return NextResponse.json(
        { error: '无效的导入数据格式' },
        { status: 400 }
      );
    }
    
    // 读取现有备忘数据
    const existingNotes = await readNotes();
    
    // 合并现有和导入的备忘数据
    // 策略：如果ID冲突，以导入的数据为准
    const mergedNotes: NoteItem[] = [...existingNotes];
    
    // 处理导入的每条备忘数据
    for (const importedNote of importedNotes) {
      const existingIndex = mergedNotes.findIndex(note => note.id === importedNote.id);
      if (existingIndex >= 0) {
        // 更新现有数据
        mergedNotes[existingIndex] = importedNote;
      } else {
        // 添加新数据
        mergedNotes.push(importedNote);
      }
    }
    
    // 保存合并后的数据
    await saveNotes(mergedNotes);
    
    return NextResponse.json({ 
      success: true,
      message: `成功导入 ${importedNotes.length} 条备忘数据`
    });
  } catch (error) {
    console.error('Error importing notes:', error);
    return NextResponse.json(
      { error: '导入备忘数据失败' },
      { status: 500 }
    );
  }
} 