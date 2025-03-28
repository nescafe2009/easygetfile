import { useState, useRef, FormEvent } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function TextArea() {
  const [text, setText] = useState<string>('');
  const [savedTexts, setSavedTexts] = useState<{id: number, content: string, timestamp: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 处理文本提交
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('请输入文本内容');
      return;
    }
    
    try {
      setIsLoading(true);
      // 添加新的文本记录
      const newText = {
        id: Date.now(),
        content: text,
        timestamp: new Date().toLocaleString()
      };
      
      // 保持最新的三条记录
      setSavedTexts(prev => [newText, ...prev].slice(0, 3));
      setText('');
      setError(null);
      
      // 将焦点重新放在文本区域
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      setError('文本保存失败');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 删除保存的文本
  const handleDeleteText = (id: number) => {
    setSavedTexts(prev => prev.filter(item => item.id !== id));
  };
  
  return (
    <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-medium text-gray-800">文本区域</h2>
      </div>
      
      {/* 已保存的文本显示区域 */}
      {savedTexts.length > 0 && (
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-600 mb-2">最近保存的文本：</h3>
          <div className="space-y-3">
            {savedTexts.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap relative">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-gray-500">
                    {item.timestamp}
                  </span>
                  <button
                    onClick={() => handleDeleteText(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                {item.content}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 text-sm">
          {error}
        </div>
      )}
      
      {/* 文本输入区域 */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入文本内容..."
            className="w-full border border-gray-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none h-32"
          ></textarea>
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="absolute right-3 bottom-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 