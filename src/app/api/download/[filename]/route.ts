import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(await params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);
    
    try {
      // 检查文件是否存在
      await fs.access(filePath);
    } catch (error) {
      return new NextResponse('文件不存在', { status: 404 });
    }
    
    // 读取文件内容
    const fileBuffer = await fs.readFile(filePath);
    
    // 获取文件类型
    const fileType = getContentType(filename);
    
    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', fileType);
    headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    // 返回文件内容
    return new NextResponse(fileBuffer, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('文件下载失败:', error);
    return new NextResponse('文件下载失败', { status: 500 });
  }
}

// 根据文件扩展名获取MIME类型
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
  };
  
  return mimeTypes[ext] || 'application/octet-stream';
} 