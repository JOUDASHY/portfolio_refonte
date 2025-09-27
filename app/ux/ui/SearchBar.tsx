"use client";

import { InputHTMLAttributes } from "react";
import Input from "./Input";

type SearchBarProps = InputHTMLAttributes<HTMLInputElement> & {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
};

export default function SearchBar({ 
  placeholder = "Rechercher…", 
  onSearch,
  className = "",
  ...props 
}: SearchBarProps) {
  return (
    <div className={`relative w-56 ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
       <SearchIcon className="icon-sm text-navy" />
      </div>
      <Input
        placeholder={placeholder}
        onChange={(e) => {
          props.onChange?.(e);
          onSearch?.(e.target.value);
        }}
        className="pl-10"
        {...props}
      />
    </div>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
}
