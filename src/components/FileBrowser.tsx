import { useState, useEffect, ChangeEvent } from 'react';
import { FileItem } from '@/types';
import { 
  DocumentIcon, 
  DocumentTextIcon, 
  PhotoIcon, 
  FilmIcon, 
  MusicalNoteIcon, 
  CodeBracketIcon,
  ArrowUpTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function FileBrowser() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // 获取文件列表
  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/files');
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      
      const data = await response.json();
      setFiles(data);
      setError(null);
    } catch (err) {
      setError('无法加载文件列表');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件加载时获取文件
  useEffect(() => {
    fetchFiles();
  }, []);
  
  // 处理文件上传
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    if (!fileInput.files || fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setIsUploading(true);
      const response = await fetch('/api/files', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      await fetchFiles();
    } catch (err) {
      setError('文件上传失败');
      console.error(err);
    } finally {
      setIsUploading(false);
      // 重置文件输入框
      fileInput.value = '';
    }
  };
  
  // 处理文件删除
  const handleDeleteFile = async (fileName: string) => {
    try {
      const response = await fetch(`/api/files?fileName=${fileName}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      
      await fetchFiles();
    } catch (err) {
      setError('文件删除失败');
      console.error(err);
    }
  };
  
  // 根据文件类型获取图标
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <DocumentTextIcon className="w-8 h-8 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <PhotoIcon className="w-8 h-8 text-green-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FilmIcon className="w-8 h-8 text-purple-500" />;
      case 'mp3':
      case 'wav':
        return <MusicalNoteIcon className="w-8 h-8 text-pink-500" />;
      case 'js':
      case 'ts':
      case 'html':
      case 'css':
      case 'json':
        return <CodeBracketIcon className="w-8 h-8 text-yellow-500" />;
      default:
        return <DocumentIcon className="w-8 h-8 text-gray-500" />;
    }
  };
  
  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };
  
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">文件浏览器</h2>
        <label className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
          <ArrowUpTrayIcon className="w-4 h-4" />
          <span>上传文件</span>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 text-sm">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-2 min-h-[500px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无文件，请上传文件
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {files.map((file) => (
              <li 
                key={file.id} 
                className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-medium text-gray-900 hover:text-blue-500"
                    >
                      {file.name}
                    </a>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)} · {new Date(file.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 