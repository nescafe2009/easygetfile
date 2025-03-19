import { useState, useEffect, useRef, FormEvent } from 'react';
import { NoteItem, KeyValuePair } from '@/types';
import { TrashIcon, PlusIcon, PaperAirplaneIcon, PencilIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function NotesDisplay() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteItems, setNewNoteItems] = useState<KeyValuePair[]>([{ key: '', value: '' }]);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const newNoteTitleRef = useRef<HTMLInputElement>(null);
  
  // 获取备忘数据
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
      setError('无法加载备忘数据');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 组件加载时获取备忘数据
  useEffect(() => {
    fetchNotes();
    
    // 设置定时刷新（每30秒）
    const intervalId = setInterval(fetchNotes, 30000);
    
    // 清理定时器
    return () => clearInterval(intervalId);
  }, []);
  
  // 删除备忘数据
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('备忘数据删除失败');
      console.error(err);
    }
  };
  
  // 编辑备忘数据
  const handleEditNote = (note: NoteItem) => {
    setEditingNote(note);
    setNewNoteTitle(note.title);
    setNewNoteItems(note.items);
    setIsCreating(true);
  };
  
  // 更新备忘数据
  const handleUpdateNote = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!newNoteTitle.trim()) {
      setError('请输入主题名称');
      return;
    }
    
    const validItems = newNoteItems.filter(item => item.key.trim() && item.value.trim());
    if (validItems.length === 0) {
      setError('请至少添加一个有效的键值对');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/notes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: editingNote?.id,
          title: newNoteTitle.trim(),
          items: validItems.map(item => ({
            key: item.key.trim(),
            value: item.value.trim()
          }))
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新备忘数据失败');
      }
      
      await fetchNotes();
      setNewNoteTitle('');
      setNewNoteItems([{ key: '', value: '' }]);
      setIsCreating(false);
      setEditingNote(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新备忘数据失败');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 创建新备忘数据
  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    
    // 验证主题
    if (!newNoteTitle.trim()) {
      setError('请输入主题名称');
      return;
    }
    
    // 验证key-value对
    const validItems = newNoteItems.filter(item => item.key.trim() && item.value.trim());
    if (validItems.length === 0) {
      setError('请至少添加一个有效的键值对');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: newNoteTitle.trim(),
          items: validItems.map(item => ({
            key: item.key.trim(),
            value: item.value.trim()
          }))
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '创建备忘数据失败');
      }
      
      await fetchNotes();
      setNewNoteTitle('');
      setNewNoteItems([{ key: '', value: '' }]);
      setIsCreating(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建备忘数据失败');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 显示创建备忘数据表单
  const showCreateForm = () => {
    setIsCreating(true);
    setTimeout(() => {
      if (newNoteTitleRef.current) {
        newNoteTitleRef.current.focus();
      }
    }, 0);
  };
  
  // 复制文本到剪贴板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('复制成功');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch {
      // 如果 clipboard API 不可用，尝试使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess('复制成功');
        setTimeout(() => setCopySuccess(null), 2000);
      } catch {
        setError('复制失败，请手动复制');
      }
      document.body.removeChild(textArea);
    }
  };
  
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">备忘数据</h2>
        {!isCreating && (
          <button
            onClick={showCreateForm}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>新建备忘数据</span>
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 text-sm">
          {error}
        </div>
      )}
      
      {copySuccess && (
        <div className="bg-green-50 text-green-500 p-3 text-sm flex items-center gap-1">
          <CheckIcon className="w-4 h-4" />
          {copySuccess}
        </div>
      )}
      
      {/* 创建/编辑备忘数据的表单 */}
      {isCreating && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            {editingNote ? '编辑备忘数据：' : '新备忘数据：'}
          </h3>
          <form onSubmit={editingNote ? handleUpdateNote : handleCreateNote}>
            <div className="grid grid-cols-12 gap-4">
              {/* 左侧：数据名称输入 */}
              <div className="col-span-3 space-y-2">
                <label className="block text-sm font-medium text-gray-700">数据名称</label>
                <input
                  ref={newNoteTitleRef}
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="输入数据名称..."
                  className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
              </div>
              
              {/* Key-Value对列表 */}
              <div className="col-span-9 space-y-2">
                <label className="block text-sm font-medium text-gray-700">键值对</label>
                {newNoteItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={item.key}
                        onChange={(e) => {
                          const newItems = [...newNoteItems];
                          newItems[index] = { ...item, key: e.target.value };
                          setNewNoteItems(newItems);
                        }}
                        placeholder="键名..."
                        className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-9 flex gap-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => {
                          const newItems = [...newNoteItems];
                          newItems[index] = { ...item, value: e.target.value };
                          setNewNoteItems(newItems);
                        }}
                        placeholder="值..."
                        className="flex-1 border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                      />
                      {newNoteItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = newNoteItems.filter((_, i) => i !== index);
                            setNewNoteItems(newItems);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewNoteItems([...newNoteItems, { key: '', value: '' }])}
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>添加键值对</span>
                </button>
              </div>
            </div>
            
            {/* 底部按钮 */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingNote(null);
                }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newNoteTitle.trim() || !newNoteItems[0].value.trim()}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <PaperAirplaneIcon className="w-4 h-4" />
                )}
                <span>{editingNote ? '更新' : '保存'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* 备忘数据列表 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            暂无备忘数据，点击&ldquo;新建备忘数据&rdquo;按钮添加
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notes.map((note) => (
              <li key={note.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="text-gray-400 hover:text-blue-500 p-1"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {note.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 text-sm bg-gray-50 p-3 rounded-lg">
                      <div className="col-span-3 font-medium text-gray-700">{item.key}</div>
                      <div className="col-span-8 text-gray-600">{item.value}</div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => copyToClipboard(item.value)}
                          className="text-gray-400 hover:text-blue-500 p-1"
                          title="复制值"
                        >
                          <ClipboardIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 