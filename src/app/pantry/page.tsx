"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Button,
  Chip,
  Divider,
  Input,
  Select,
  SelectItem,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import Navbar from "../components/common/Navigation.tsx";
import AddPantryIngredientForm from "../components/common/AddPantryIngredientForm";
import { dropdownClassNames } from "../components/common/dropdownStyles";
import {
  PantryIngredient,
  PantryIngredientCreationParams,
  PantrySortField,
} from "../types/Pantry";
import {
  addPantryIngredient,
  fetchPantryCategories,
  fetchPantryIngredients,
  getErrorMessage,
  removePantryIngredient,
  updatePantryIngredient,
} from "../services/pantryService";

const ALL = "all";

const DATE_FILTERS = [
  { key: ALL, label: "Any time" },
  { key: "1", label: "Today" },
  { key: "7", label: "Last 7 days" },
  { key: "30", label: "Last 30 days" },
];

const addedAfterDate = (days: string): string | undefined => {
  if (days === ALL) return undefined;
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - (Number(days) - 1));
  return date.toISOString();
};

interface QuantityCellProps {
  ingredient: PantryIngredient;
  onSave: (quantity: number) => Promise<void>;
}

// Inline quantity editor that saves on blur or Enter
const QuantityCell: React.FC<QuantityCellProps> = ({ ingredient, onSave }) => {
  const [value, setValue] = useState(String(ingredient.quantity));

  useEffect(() => {
    setValue(String(ingredient.quantity));
  }, [ingredient.quantity]);

  const save = async () => {
    const quantity = Number(value);
    if (value === "" || isNaN(quantity) || quantity < 0) {
      setValue(String(ingredient.quantity));
      return;
    }
    if (quantity !== ingredient.quantity) {
      await onSave(quantity);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        aria-label={`Quantity of ${ingredient.name}`}
        variant="underlined"
        size="sm"
        min={0}
        step="any"
        className="w-20"
        value={value}
        onValueChange={setValue}
        onBlur={save}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
      />
      {ingredient.unit && <span className="font-thin">{ingredient.unit}</span>}
    </div>
  );
};

export default function Page() {
  // getToken returns a fresh Clerk session token, which the backend uses to identify the user
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [ingredients, setIngredients] = useState<PantryIngredient[]>([]);
  // Unfiltered, so the add form can tell what's already in the pantry regardless of the current filters
  const [allItems, setAllItems] = useState<PantryIngredient[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [dateFilter, setDateFilter] = useState(ALL);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const loadIngredients = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) return;
      const [results, everything, categoryList] = await Promise.all([
        fetchPantryIngredients(token, {
          search: debouncedSearch || undefined,
          category: category === ALL ? undefined : category,
          addedAfter: addedAfterDate(dateFilter),
          sortBy: sortDescriptor.column as PantrySortField,
          order: sortDescriptor.direction === "ascending" ? "asc" : "desc",
        }),
        fetchPantryIngredients(token, {}),
        fetchPantryCategories(token),
      ]);
      setIngredients(results);
      setAllItems(everything);
      setCategories(categoryList);
    } catch (err) {
      console.error("Error fetching pantry:", err);
      setError(getErrorMessage(err, "Could not load your pantry."));
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, getToken, debouncedSearch, category, dateFilter, sortDescriptor]);

  useEffect(() => {
    if (isLoaded) {
      loadIngredients();
    }
  }, [isLoaded, loadIngredients]);

  const handleAdd = async (ingredient: PantryIngredientCreationParams): Promise<boolean> => {
    const token = await getToken();
    if (!token) return false;
    try {
      await addPantryIngredient(token, ingredient);
      setError(null);
      await loadIngredients();
      return true;
    } catch (err) {
      console.error("Error adding pantry ingredient:", err);
      setError(getErrorMessage(err, "Could not add that ingredient."));
      return false;
    }
  };

  const handleAddToExisting = async (item: PantryIngredient, amount: number): Promise<boolean> => {
    const token = await getToken();
    if (!token) return false;
    try {
      await updatePantryIngredient(token, item._id, { quantity: item.quantity + amount });
      setError(null);
      await loadIngredients();
      return true;
    } catch (err) {
      console.error("Error updating pantry ingredient:", err);
      setError(getErrorMessage(err, `Could not add to ${item.name}.`));
      return false;
    }
  };

  const handleQuantityChange = async (ingredient: PantryIngredient, quantity: number) => {
    const token = await getToken();
    if (!token) return;
    try {
      const updated = await updatePantryIngredient(token, ingredient._id, { quantity });
      setError(null);
      setIngredients((current) => current.map((i) => (i._id === updated._id ? updated : i)));
      setAllItems((current) => current.map((i) => (i._id === updated._id ? updated : i)));
    } catch (err) {
      console.error("Error updating pantry ingredient:", err);
      setError(getErrorMessage(err, `Could not update ${ingredient.name}.`));
    }
  };

  const handleRemove = async (ingredient: PantryIngredient) => {
    const token = await getToken();
    if (!token) return;
    try {
      await removePantryIngredient(token, ingredient._id);
      setError(null);
      await loadIngredients();
    } catch (err) {
      console.error("Error removing pantry ingredient:", err);
      setError(getErrorMessage(err, `Could not remove ${ingredient.name}.`));
    }
  };

  const hasFilters = debouncedSearch !== "" || category !== ALL || dateFilter !== ALL;

  return (
    <div className="bg-off-white min-h-screen flex flex-col text-green-text">
      <Navbar />
      <div className="p-4 md:p-8 m-2">
        <h1 className="text-3xl md:text-5xl">Pantry</h1>
        <p className="my-4">
          Keep track of what you already have at home so you only buy what you need.
        </p>

        <AddPantryIngredientForm
          pantryItems={allItems}
          onAdd={handleAdd}
          onAddToExisting={handleAddToExisting}
        />

        {error && <p className="text-danger mb-4">{error}</p>}

        <Divider className="bg-dark-green my-4" />

        {/* Same label + size on all three so they render at the same height and line up */}
        <div className="flex flex-col md:flex-row md:items-end gap-2 mb-4">
          <Input
            type="search"
            label="Search"
            placeholder="Search your pantry..."
            variant="underlined"
            size="sm"
            className="md:max-w-md"
            value={search}
            onValueChange={setSearch}
            isClearable
            onClear={() => setSearch("")}
          />
          <Select
            label="Category"
            variant="underlined"
            size="sm"
            className="md:max-w-xs"
            classNames={dropdownClassNames}
            selectedKeys={[category]}
            disallowEmptySelection
            onSelectionChange={(keys) => setCategory(Array.from(keys)[0] as string)}
            items={[{ key: ALL, label: "All categories" }, ...categories.map((c) => ({ key: c, label: c }))]}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
          <Select
            label="Date added"
            variant="underlined"
            size="sm"
            className="md:max-w-xs"
            classNames={dropdownClassNames}
            selectedKeys={[dateFilter]}
            disallowEmptySelection
            onSelectionChange={(keys) => setDateFilter(Array.from(keys)[0] as string)}
            items={DATE_FILTERS}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </div>

        <Table
          aria-label="Pantry ingredients"
          radius="none"
          shadow="none"
          classNames={{ wrapper: "bg-transparent border border-border-color p-2", th: "bg-light-green text-green-text" }}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader>
            <TableColumn key="name" allowsSorting>
              Name
            </TableColumn>
            <TableColumn key="quantity" allowsSorting>
              Quantity
            </TableColumn>
            <TableColumn key="createdAt" allowsSorting>
              Date Added
            </TableColumn>
            <TableColumn key="actions" align="end">
              <span className="sr-only">Actions</span>
            </TableColumn>
          </TableHeader>
          <TableBody
            items={ingredients}
            isLoading={isLoading}
            loadingContent={<Spinner color="success" />}
            emptyContent={
              hasFilters
                ? "No ingredients match your filters."
                : "Your pantry is empty. Add an ingredient above to get started."
            }
          >
            {(ingredient) => (
              <TableRow key={ingredient._id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{ingredient.name}</span>
                    {ingredient.category && (
                      <Chip size="sm" variant="flat" className="bg-light-green text-green-text">
                        {ingredient.category}
                      </Chip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <QuantityCell
                    ingredient={ingredient}
                    onSave={(quantity) => handleQuantityChange(ingredient, quantity)}
                  />
                </TableCell>
                <TableCell>{new Date(ingredient.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    radius="none"
                    variant="light"
                    className="font-thin"
                    onClick={() => handleRemove(ingredient)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
