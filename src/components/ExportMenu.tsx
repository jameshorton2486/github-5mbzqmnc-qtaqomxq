import React, { useState, useRef, useEffect } from 'react';
import { FileText, Download, WholeWord as FileWord } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ExportMenuProps {
  onExport: (format: 'gdocs' | 'word' | 'pdf') => void;
  className?: string;
}

export function ExportMenu({ onExport, className = '' }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, format: 'gdocs' | 'word' | 'pdf') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onExport(format);
      setIsOpen(false);
    }
  };

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <Tooltip content="Export Options" position="top">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
          aria-label="Export options"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Download className="h-5 w-5 text-gray-300" />
        </button>
      </Tooltip>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="export-menu"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => {
                onExport('gdocs');
                setIsOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, 'gdocs')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
              role="menuitem"
              tabIndex={0}
            >
              <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
              Google Docs
            </button>

            <button
              onClick={() => {
                onExport('word');
                setIsOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, 'word')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
              role="menuitem"
              tabIndex={0}
            >
              <FileWord className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
              Microsoft Word
            </button>

            <button
              onClick={() => {
                onExport('pdf');
                setIsOpen(false);
              }}
              onKeyDown={(e) => handleKeyDown(e, 'pdf')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-200"
              role="menuitem"
              tabIndex={0}
            >
              <FileText className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" />
              PDF Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}