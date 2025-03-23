import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  withText?: boolean;
  className?: string;
  textColor?: string;
  interactive?: boolean;
}

export default function Logo({ 
  size = 32, 
  withText = true, 
  className = '',
  textColor = 'text-gray-800',
  interactive = true
}: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showShine, setShowShine] = useState(false);
  
  // 计算文字大小，根据logo尺寸动态调整
  const textSize = size <= 32 ? 'text-lg' : size <= 40 ? 'text-xl' : 'text-2xl';
  
  // 页面载入时添加一次闪光效果
  useEffect(() => {
    setTimeout(() => {
      setShowShine(true);
      
      const timer = setTimeout(() => {
        setShowShine(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }, 1000);
  }, []);
  
  return (
    <div 
      className={`flex items-center gap-4 ${className} ${interactive ? 'cursor-pointer' : ''}`}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
    >
      <motion.div
        animate={isHovered ? { rotate: 10, scale: 1.05 } : { rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="drop-shadow-md relative"
      >
        <Image 
          src="/logo.svg" 
          alt="EasyGetFile Logo" 
          width={size} 
          height={size}
          className="rounded-md"
          priority
        />
        
        {/* 闪光效果 */}
        {showShine && (
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, times: [0, 0.5, 1] }}
          >
            <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 translate-x-full animate-shine" />
          </motion.div>
        )}
      </motion.div>
      {withText && (
        <motion.h1 
          className={`${textSize} font-bold ${textColor} drop-shadow-sm`}
          animate={isHovered ? { y: -2 } : { y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          EasyGetFile
        </motion.h1>
      )}
    </div>
  );
} 