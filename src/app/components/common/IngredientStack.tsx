"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";

export type ProductOption = {
  item: string;
  upc: string;
  description?: string;
  size?: string;
  thumbnailUrl?: string;
  price?: number;
  promoPrice?: number;
};

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

export type SelectedItem = { upc: string; quantity: number };

type ItemStatus = "added" | "skipped" | "pending";

interface IngredientStackProps {
  groups: ProductOption[][];
  getTitle: (group: ProductOption[]) => string;
  selectedItems: SelectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
}

const IngredientStack: React.FC<IngredientStackProps> = ({
  groups,
  getTitle,
  selectedItems,
  setSelectedItems,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [skipped, setSkipped] = useState<Set<number>>(new Set());
  const [isFinished, setIsFinished] = useState(false);

  // Start over whenever a new recipe is ingested
  useEffect(() => {
    setCurrentIndex(0);
    setSkipped(new Set());
    setIsFinished(false);
  }, [groups]);

  const quantityOf = (upc: string) =>
    selectedItems.find((i) => i.upc === upc)?.quantity ?? 0;

  // Selecting a product always wins over an earlier skip
  const statusOf = (index: number): ItemStatus => {
    if (groups[index].some((product) => quantityOf(product.upc) > 0)) {
      return "added";
    }
    return skipped.has(index) ? "skipped" : "pending";
  };

  const goTo = (index: number) => {
    setDirection(index >= currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsFinished(false);
  };

  // Move to the next item still waiting on a decision, or finish the stack
  const advance = (justSkipped?: number) => {
    const isPending = (i: number) =>
      i !== currentIndex &&
      i !== justSkipped &&
      statusOf(i) === "pending";

    for (let step = 1; step < groups.length; step++) {
      const next = (currentIndex + step) % groups.length;
      if (isPending(next)) {
        setDirection(1);
        setCurrentIndex(next);
        return;
      }
    }
    setIsFinished(true);
  };

  const changeQuantity = (upc: string, delta: number) => {
    setSelectedItems((prev) => {
      if (!prev.some((i) => i.upc === upc)) {
        return delta > 0 ? [...prev, { upc, quantity: delta }] : prev;
      }
      return prev
        .map((i) =>
          i.upc === upc ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0);
    });
  };

  const skipCurrent = () => {
    const upcs = new Set(groups[currentIndex].map((product) => product.upc));
    setSelectedItems((prev) => prev.filter((i) => !upcs.has(i.upc)));
    setSkipped((prev) => new Set(prev).add(currentIndex));
    advance(currentIndex);
  };

  const counts = groups.reduce(
    (acc, _, index) => {
      acc[statusOf(index)]++;
      return acc;
    },
    { added: 0, skipped: 0, pending: 0 } as Record<ItemStatus, number>
  );

  const group = groups[currentIndex];
  if (!group) return null;
  const currentStatus = statusOf(currentIndex);

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Breadcrumb */}
      <div className="w-full flex items-center justify-between mb-2">
        <Button
          isIconOnly
          radius="none"
          size="sm"
          variant="light"
          aria-label="Previous item"
          isDisabled={currentIndex === 0}
          onClick={() => goTo(currentIndex - 1)}
        >
          ‹
        </Button>
        <div className="text-center">
          <p className="font-medium">
            Item {currentIndex + 1} of {groups.length}
          </p>
          <p className="font-thin text-sm">
            {counts.added} added · {counts.skipped} skipped ·{" "}
            {counts.pending} left
          </p>
        </div>
        <Button
          isIconOnly
          radius="none"
          size="sm"
          variant="light"
          aria-label="Next item"
          isDisabled={currentIndex === groups.length - 1}
          onClick={() => goTo(currentIndex + 1)}
        >
          ›
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 mb-6">
        {groups.map((g, index) => {
          const status = statusOf(index);
          return (
            <Tooltip
              key={index}
              content={`${getTitle(g)} — ${status}`}
              classNames={{ content: ["text-green-text"] }}
            >
              <button
                type="button"
                aria-label={`Go to ${getTitle(g)}`}
                onClick={() => goTo(index)}
                className={`h-2.5 w-6 border border-dark-green transition-colors ${
                  status === "added"
                    ? "bg-dark-green"
                    : status === "skipped"
                    ? "bg-border-color border-border-color"
                    : "bg-off-white"
                } ${
                  index === currentIndex && !isFinished
                    ? "outline outline-2 outline-offset-2 outline-peach"
                    : ""
                }`}
              />
            </Tooltip>
          );
        })}
      </div>

      {/* Stack */}
      <div className="relative w-full">
        {/* Cards peeking out behind the current one */}
        {!isFinished && counts.pending > 1 && (
          <div className="absolute inset-0 translate-x-3 translate-y-3 border border-border-color bg-off-white" />
        )}
        {!isFinished && counts.pending > 0 && (
          <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-border-color bg-off-white" />
        )}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={isFinished ? "finished" : currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.2 }}
            className="relative bg-off-white border border-dark-green p-4 md:p-6"
          >
            {isFinished ? (
              <div className="text-center py-8">
                <h3 className="font-medium text-lg mb-2">
                  You&apos;ve worked through every ingredient
                </h3>
                <p className="font-thin">
                  {counts.added} added, {counts.skipped} skipped. Use the
                  arrows above to revisit anything, or add your picks to the
                  cart below.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <h3 className="text-center font-medium text-lg">
                    {getTitle(group)}
                  </h3>
                  {currentStatus !== "pending" && (
                    <span className="text-xs font-thin border border-border-color px-2">
                      {currentStatus}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {group.map((product) => {
                    const quantity = quantityOf(product.upc);
                    return (
                      <div
                        key={product.upc}
                        className={`flex flex-col items-center text-center p-2 border ${
                          quantity > 0
                            ? "border-dark-green bg-light-green"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={product.thumbnailUrl}
                          alt={product.description ?? product.item}
                          className="mb-2 max-h-32 object-contain cursor-pointer"
                          onClick={() => changeQuantity(product.upc, 1)}
                        />
                        <p className="mb-1 text-sm">{product.description}</p>
                        {product.price !== undefined && (
                          <p className="mb-1 text-sm font-medium">
                            {product.promoPrice !== undefined &&
                            product.promoPrice < product.price ? (
                              <>
                                <span className="text-peach">
                                  {formatPrice(product.promoPrice)}
                                </span>{" "}
                                <span className="font-thin line-through">
                                  {formatPrice(product.price)}
                                </span>
                              </>
                            ) : (
                              formatPrice(product.price)
                            )}
                          </p>
                        )}
                        <p className="mb-2 text-sm font-thin">{product.size}</p>
                        {quantity > 0 ? (
                          <div className="flex items-center">
                            <Button
                              className="mx-2 bg-peach border border-dark-green font-thin"
                              radius="none"
                              size="sm"
                              isIconOnly
                              onClick={() => changeQuantity(product.upc, -1)}
                            >
                              -
                            </Button>
                            <span>{quantity}</span>
                            <Button
                              className="mx-2 bg-peach border border-dark-green font-thin"
                              radius="none"
                              size="sm"
                              isIconOnly
                              onClick={() => changeQuantity(product.upc, 1)}
                            >
                              +
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="bg-off-white border border-dark-green font-thin"
                            radius="none"
                            size="sm"
                            onClick={() => changeQuantity(product.upc, 1)}
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    className="bg-off-white border border-dark-green font-thin"
                    radius="none"
                    onClick={skipCurrent}
                  >
                    Skip
                  </Button>
                  <Button
                    className="bg-peach border border-dark-green font-thin"
                    radius="none"
                    isDisabled={currentStatus !== "added"}
                    onClick={() => advance()}
                  >
                    Add &amp; Next
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IngredientStack;
