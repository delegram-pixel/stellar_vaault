// components/CopyBox.tsx
import React, { useState } from 'react';
import { Check, ClipboardIcon, Copy } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CopyBoxProps {
  value: string;
  className?: string;
}

const CopyBox = ({ value, onCopy }:any) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    if (onCopy) onCopy();
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        readOnly
        className="w-full pr-10 bg-gray-100 border text-black border-gray-300 rounded-md py-2 px-3 text-sm"
      />
      <button
        onClick={handleCopy}
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
      >
        <ClipboardIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};
export default CopyBox;