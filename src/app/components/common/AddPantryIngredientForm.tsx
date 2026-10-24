"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import {
  Category,
  Ingredient,
  PantryIngredient,
  PantryIngredientCreationParams,
  Unit,
} from "../../types/Pantry";
import {
  fetchCategoryOptions,
  fetchUnitOptions,
  searchIngredientCatalog,
} from "../../services/pantryService";
import { dropdownClassNames } from "./dropdownStyles";

interface AddPantryIngredientFormProps {
  // Every item in the user's pantry (unfiltered), used to spot ingredients they already have
  pantryItems: PantryIngredient[];
  onAdd: (ingredient: PantryIngredientCreationParams) => Promise<boolean>;
  onAddToExisting: (item: PantryIngredient, amount: number) => Promise<boolean>;
}

// Same normalization the backend uses for matching, e.g. " Brown  Sugar" -> "brown sugar"
const normalizeName = (name: string) => name.trim().replace(/\s+/g, " ").toLowerCase();

const formatQuantity = (item: PantryIngredient) =>
  `${item.quantity}${item.unit ? ` ${item.unit}` : ""}`;

const AddPantryIngredientForm: React.FC<AddPantryIngredientFormProps> = ({
  pantryItems,
  onAdd,
  onAddToExisting,
}) => {
  const [name, setName] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState<Unit>("");
  const [category, setCategory] = useState<Category>("");
  const [unitOptions, setUnitOptions] = useState<Unit[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    fetchUnitOptions()
      .then(setUnitOptions)
      .catch((error) => console.error("Error fetching units:", error));
    fetchCategoryOptions()
      .then(setCategoryOptions)
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  // Suggest ingredients that already exist in the shared catalog
  useEffect(() => {
    if (!name.trim()) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setSuggestions(await searchIngredientCatalog(name));
      } catch (error) {
        console.error("Error searching ingredients:", error);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [name]);

  const normalizedName = normalizeName(name);

  // A typed name that exactly matches a catalog entry counts as picking it
  const catalogMatch =
    selectedIngredient ??
    (normalizedName ? suggestions.find((s) => s.normalizedName === normalizedName) : undefined) ??
    null;

  // The same ingredient already in this pantry, matched by catalog entry (covers renamed items) or by name
  const existingItem = normalizedName
    ? pantryItems.find(
        (item) =>
          (catalogMatch && item.ingredientId === catalogMatch._id) ||
          item.normalizedName === normalizedName
      ) ?? null
    : null;

  // Fill in the catalog's unit and category when a match is found, without overwriting the user's choices
  useEffect(() => {
    if (catalogMatch) {
      setUnit((current) => current || catalogMatch.unit || "");
      setCategory((current) => current || catalogMatch.category || "");
    }
  }, [catalogMatch]);

  const selectSuggestion = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setName(ingredient.name);
    setShowSuggestions(false);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setShowSuggestions(true);
    setHighlightedIndex(-1);
    if (selectedIngredient && value !== selectedIngredient.name) {
      setSelectedIngredient(null);
    }
  };

  const isSuggestionListOpen = showSuggestions && suggestions.length > 0;

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSuggestionListOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      // Pick the highlighted suggestion instead of submitting the form
      e.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const parsedQuantity = Number(quantity);
  const isValid = name.trim() !== "" && quantity !== "" && parsedQuantity >= 0;

  const resetForm = () => {
    setName("");
    setSelectedIngredient(null);
    setQuantity("1");
    setUnit("");
    setCategory("");
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    const saved = existingItem
      ? await onAddToExisting(existingItem, parsedQuantity)
      : await onAdd({
          ...(catalogMatch ? { ingredientId: catalogMatch._id } : { name: name.trim() }),
          quantity: parsedQuantity,
          unit: unit || undefined,
          category: category || undefined,
        });
    setIsSubmitting(false);

    if (saved) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-start gap-2 mb-6">
      {/* Plain input + suggestion list: NextUI 2.2.9's Autocomplete crashes in react-aria when its popover opens */}
      <div className="relative md:flex-[2]">
        <Input
          label="Ingredient"
          variant="underlined"
          isRequired
          autoComplete="off"
          role="combobox"
          aria-expanded={isSuggestionListOpen}
          aria-controls="pantry-ingredient-suggestions"
          aria-autocomplete="list"
          value={name}
          onValueChange={handleNameChange}
          onKeyDown={handleNameKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          description={
            existingItem
              ? `You already have ${formatQuantity(existingItem)} of ${existingItem.name}. This will add to it.`
              : undefined
          }
          classNames={{ description: "text-dark-green" }}
        />
        {isSuggestionListOpen && (
          <ul
            id="pantry-ingredient-suggestions"
            role="listbox"
            className="absolute z-20 left-0 right-0 mt-1 max-h-60 overflow-auto bg-off-white border border-border-color shadow-md"
          >
            {suggestions.map((ingredient, index) => (
              <li
                key={ingredient._id}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`px-3 py-2 cursor-pointer ${index === highlightedIndex ? "bg-light-green" : "hover:bg-light-green"}`}
                // mousedown fires before the input's blur, so the list is still there to click
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(ingredient);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {ingredient.name}
                {ingredient.category && <span className="text-tiny opacity-60"> · {ingredient.category}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Input
        type="number"
        label={existingItem ? "Quantity to add" : "Quantity"}
        variant="underlined"
        min={0}
        step="any"
        isRequired
        className="md:flex-1"
        value={quantity}
        onValueChange={setQuantity}
        isInvalid={quantity !== "" && parsedQuantity < 0}
      />
      {/* An existing item keeps its own unit and category, so those are locked while adding to it */}
      <Select
        label="Unit"
        placeholder="Choose a unit"
        variant="underlined"
        className="md:flex-1"
        classNames={dropdownClassNames}
        isDisabled={!!existingItem}
        selectedKeys={existingItem ? (existingItem.unit ? [existingItem.unit] : []) : unit ? [unit] : []}
        onSelectionChange={(keys) => setUnit((Array.from(keys)[0] as string) ?? "")}
      >
        {unitOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Category"
        placeholder="Choose a category"
        variant="underlined"
        className="md:flex-1"
        classNames={dropdownClassNames}
        isDisabled={!!existingItem}
        selectedKeys={
          existingItem ? (existingItem.category ? [existingItem.category] : []) : category ? [category] : []
        }
        onSelectionChange={(keys) => setCategory((Array.from(keys)[0] as string) ?? "")}
      >
        {categoryOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </Select>
      <Button
        type="submit"
        radius="none"
        isDisabled={!isValid}
        isLoading={isSubmitting}
        className="bg-peach border border-dark-green font-thin mt-2"
      >
        {existingItem ? "Add to Existing" : "Add to Pantry"}
      </Button>
    </form>
  );
};

export default AddPantryIngredientForm;
