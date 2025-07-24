import React from 'react';
import { ArrowLeft, MoreHorizontal } from 'lucide-react';

interface MonochromeHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
  subtitle?: string;
}

export const MonochromeHeader: React.FC<MonochromeHeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  rightAction,
  subtitle,
}) => {
  return (
    <header className="bg-white safe-area-pt" style={{ display: 'none' }}>
      <div className="flex items-center justify-between h-14 px-4">
        {/* 左側 */}
        <div className="flex items-center min-w-0 flex-1">
          {showBackButton && (
            <button
              onClick={onBackClick}
              className="mr-3 p-2 -ml-2 text-gray-700 hover:text-black transition-colors"
              aria-label="戻る"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-black truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* 右側 */}
        <div className="flex items-center ml-3">
          {rightAction || (
            <button
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="メニュー"
            >
              <MoreHorizontal size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};