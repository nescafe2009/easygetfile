import { useState, useEffect } from 'react';
import { NoteItem } from '@/types';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function NotesDisplay() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取备忘录
  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('无法加载备忘录');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件加载时获取备忘录
  useEffect(() => {
    fetchNotes();
    
    // 设置定时刷新（每30秒）
    const intervalId = setInterval(fetchNotes, 30000);
    
    // 清理定时器
    return () => clearInterval(intervalId);
  }, []);
  
  // 删除备忘录
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      
      // 更新本地状态，移除已删除的笔记
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('备忘录删除失败');
      console.error(err);
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-800">备忘录</h2>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 text-sm">
          {error}
        </div>
      )}
      
      <div className="max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无备忘录，请在左下方文本区域添加
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notes.map((note) => (
              <li key={note.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500">
                    创建于: {formatDate(note.createdAt)}
                  </span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {note.content}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 