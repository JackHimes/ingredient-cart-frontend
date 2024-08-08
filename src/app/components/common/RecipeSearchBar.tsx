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
    <div className="flex flex-col md:flex-row w-full max-w-md gap-2 mb-4">
      <Input
        type="text"
        placeholder="Search recipes..."
        variant="underlined"
        classNames={{
            label: "text-center font-thin w-full",
            innerWrapper: "w-full text-center items-center",
            inputWrapper: "w-full text-center items-center",
            input: "w-full text-center items-center",
            base: "w-full",
          }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button 
        onClick={handleSearch} 
        radius='none'
        className="bg-peach border border-dark-green font-thin mt-2 md:mt-0 md:ml-2"
      >
        Search
      </Button>
    </div>
  );
};

export default RecipeSearchBar;