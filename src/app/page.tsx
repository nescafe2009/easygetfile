'use client';

import FileBrowser from '@/components/FileBrowser';
import TextArea from '@/components/TextArea';
import NotesDisplay from '@/components/NotesDisplay';
import Logo from '@/components/Logo';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-md h-16 flex items-center px-6 sticky top-0 z-10 border-b border-blue-100">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo 
            size={52} 
            className="py-1" 
            textColor="text-blue-600"
          />
        </motion.div>
      </header>
      
      {/* 主要内容区 */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full min-h-[calc(100vh-8rem)]">
          {/* 左侧布局 */}
          <div className="lg:col-span-2 flex flex-col gap-6 h-full">
            {/* 文件浏览器 - 占据更大空间 */}
            <div className="flex-[3]">
              <FileBrowser />
            </div>
            
            {/* 文本区域 - 较小空间 */}
            <div className="flex-[2]">
              <TextArea />
            </div>
          </div>
          
          {/* 右侧布局 - 备忘录 */}
          <div className="lg:col-span-3 h-full">
            <NotesDisplay />
          </div>
        </div>
      </main>
      
      {/* 底部导航栏 */}
      <footer className="py-4 bg-white border-t text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} EasyGetFile. 保留所有权利。</p>
      </footer>
    </div>
  );
}
