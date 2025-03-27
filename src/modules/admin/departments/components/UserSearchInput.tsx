
import React from 'react';
import { Input } from '@/components/ui/input';

interface UserSearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UserSearchInput: React.FC<UserSearchInputProps> = ({ value, onChange }) => {
  return (
    <Input 
      placeholder="Buscar usuários..."
      value={value}
      onChange={onChange}
      className="mb-4"
    />
  );
};
