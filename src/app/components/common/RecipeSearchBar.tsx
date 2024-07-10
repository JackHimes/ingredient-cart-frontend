import React, { useState } from 'react';
import { Input, Button } from "@nextui-org/react";

interface RecipeSearchBarProps {
  onSearch: (query: string) => void;
}

const RecipeSearchBar: React.FC<RecipeSearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-md gap-2 mb-4">
      <Input
        type="text"
        placeholder="Search recipes..."
        variant="underlined"
        classNames={{
            label: "text-center font-thin w-full",
            innerWrapper: "w-1/2 text-center items-center w-full",
            inputWrapper: "text-center items-center w-full",
            input: "text-center items-center w-full",
            base: "w-1/2",
          }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button 
        onClick={handleSearch} 
        className="bg-peach border border-dark-green font-thin"
      >
        Search
      </Button>
    </div>
  );
};

export default RecipeSearchBar;