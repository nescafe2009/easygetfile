import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileItem } from '@/types';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const FILES_FILE = path.join(process.cwd(), 'data', 'files.json');

// 确保上传目录存在
async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

// 确保数据目录存在
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 读取文件列表
async function readFiles(): Promise<FileItem[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(FILES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 保存文件列表
async function saveFiles(files: FileItem[]) {
  await ensureDataDir();
  await fs.writeFile(FILES_FILE, JSON.stringify(files, null, 2));
}

// 获取文件列表
export async function GET() {
  try {
    await ensureUploadsDir();
    
    const files = await fs.readdir(UPLOADS_DIR);
    const fileDetails = await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(UPLOADS_DIR, fileName);
        const stats = await fs.stat(filePath);
        
        return {
          id: fileName,
          name: fileName,
          path: `/uploads/${fileName}`,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          type: path.extname(fileName).slice(1)
        } as FileItem;
      })
    );
    
    return NextResponse.json(fileDetails);
  } catch (error) {
    console.error('Error getting files:', error);
    return NextResponse.json(
      { error: 'Failed to get files' },
      { status: 500 }
    );
  }
}

// 上传文件
export async function POST(request: NextRequest) {
  try {
    await ensureUploadsDir();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.writeFile(filePath, buffer);
    
    const stats = await fs.stat(filePath);
    const fileInfo: FileItem = {
      id: fileName,
      name: file.name,
      path: `/uploads/${fileName}`,
      size: stats.size,
      createdAt: new Date().toISOString(),
      type: path.extname(file.name).slice(1)
    };
    
    return NextResponse.json(fileInfo);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// 删除文件
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    
    if (!fileName) {
      return NextResponse.json(
        { error: 'No file name provided' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    await fs.unlink(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
} 