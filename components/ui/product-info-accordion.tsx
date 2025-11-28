"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface InfoSection {
  key: string;
  title: string;
  content: string;
}

export interface ProductInfoAccordionProps {
  sections: InfoSection[];
  className?: string;
}

export function ProductInfoAccordion({
  sections,
  className,
}: ProductInfoAccordionProps) {
  const [expandedSection, setExpandedSection] = useState<string>('');

  const toggleSection = (key: string) => {
    setExpandedSection(expandedSection === key ? '' : key);
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {sections.map(({ key, title, content }) => (
        <div key={key} className="flex flex-col items-start gap-4 w-full border-b border-neutral-200 pb-4 last:border-b-0">
          <button
            onClick={() => toggleSection(key)}
            className="flex justify-between items-center w-full text-left cursor-pointer group"
            aria-expanded={expandedSection === key}
          >
            <span className="text-neutral-600 text-base sm:text-lg font-medium group-hover:text-neutral-900 transition-colors">
              {title}
            </span>
            {expandedSection === key ? (
              <ChevronUp className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            ) : (
              <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            )}
          </button>
          
          {expandedSection === key && content && (
            <div className="w-full animate-in slide-in-from-top-2 duration-200">
              <p className="text-neutral-500 text-sm sm:text-base font-normal leading-relaxed">
                {content}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
