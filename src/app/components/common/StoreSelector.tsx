"use client";

import React, { FormEvent, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import TokenStatusIndicator from "./TokenStatusIndicator";
import { findStores, KrogerStore } from "../../services/storeService";

interface StoreSelectorProps {
  token: string;
  isTokenValid: boolean;
  store: KrogerStore | null;
  onStoreChange: (store: KrogerStore) => void;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  token,
  isTokenValid,
  store,
  onStoreChange,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [zipCode, setZipCode] = useState("");
  const [stores, setStores] = useState<KrogerStore[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStores = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{5}$/.test(zipCode)) {
      setError("Enter a 5 digit zip code");
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const results = await findStores(zipCode, token);
      setStores(results);
      if (results.length === 0) {
        setError("No stores found near that zip code");
      }
    } catch (error) {
      console.error("Error finding stores:", error);
      setStores([]);
      setError("Couldn't look up stores. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center w-full justify-center space-x-2 mt-4">
      <p className="font-thin text-center">
        {store ? `${store.name} — ${store.address}` : "No store selected"}
      </p>
      <Button
        className="mx-0 md:mx-4 my-2 md:my-0 bg-peach border border-dark-green font-thin w-full md:w-auto"
        radius="none"
        onClick={onOpen}
        isDisabled={!isTokenValid}
      >
        {store ? "Change Store" : "Set Store"}
      </Button>
      <TokenStatusIndicator
        status={store ? "valid" : "invalid"}
        messages={{
          valid: "Products will be filtered to curbside pickup at this store.",
          invalid: "Select a store before extracting ingredients.",
        }}
      />

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="none"
        scrollBehavior="inside"
        className="bg-off-white text-green-text"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-medium">Find your store</ModalHeader>
              <ModalBody className="pb-6">
                <form onSubmit={searchStores} className="flex items-end gap-2">
                  <Input
                    value={zipCode}
                    onValueChange={setZipCode}
                    label="Zip code"
                    variant="underlined"
                    inputMode="numeric"
                    maxLength={5}
                  />
                  <Button
                    type="submit"
                    className="bg-peach border border-dark-green font-thin"
                    radius="none"
                    isLoading={isSearching}
                  >
                    Search
                  </Button>
                </form>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {isSearching && <Spinner color="success" className="my-4" />}
                <div className="flex flex-col gap-2">
                  {stores.map((result) => (
                    <button
                      key={result.locationId}
                      type="button"
                      className={`text-left border p-3 hover:bg-peach ${
                        result.locationId === store?.locationId
                          ? "border-dark-green bg-peach"
                          : "border-border-color"
                      }`}
                      onClick={() => {
                        onStoreChange(result);
                        onClose();
                      }}
                    >
                      <p className="font-medium">{result.name}</p>
                      <p className="font-thin text-sm">{result.address}</p>
                    </button>
                  ))}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StoreSelector;
