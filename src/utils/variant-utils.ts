import {
  type VariantGroup,
  type VariantCombination,
} from "@/types/product-form";

// Optimized combination generation with early returns and better performance
export const generateVariantCombinations = (
  variantGroups: VariantGroup[],
): VariantCombination[] => {
  // Early return for empty or invalid groups
  if (variantGroups.length === 0) return [];

  // Filter out groups with no options
  const validGroups = variantGroups.filter((group) => group.options.length > 0);
  if (validGroups.length === 0) return [];

  // Calculate total combinations to prevent excessive memory usage
  const totalCombinations = validGroups.reduce(
    (acc, group) => acc * group.options.length,
    1,
  );
  if (totalCombinations > 1000) {
    console.warn(
      `Too many combinations (${totalCombinations}). Consider reducing options.`,
    );
    return [];
  }

  const combinations: VariantCombination[] = [];

  // Use iterative approach instead of recursion for better performance
  const generateIteratively = () => {
    const indices = new Array(validGroups.length).fill(0);

    do {
      const combination: Record<string, string> = {};

      // Build combination from current indices
      for (let i = 0; i < validGroups.length; i++) {
        const group = validGroups[i];
        if (!group) continue;

        const optionIndex = indices[i] as number;
        if (optionIndex !== undefined && optionIndex >= 0) {
          const option = group.options[optionIndex];
          if (option) {
            combination[group.id] = option.id;
          }
        }
      }

      combinations.push({
        id: `combo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        combination,
        price: 0,
        stock: 0,
      });
    } while (incrementIndices(indices as number[], validGroups));
  };

  generateIteratively();
  return combinations;
};

// Helper function to increment indices like an odometer
const incrementIndices = (
  indices: number[],
  groups: VariantGroup[],
): boolean => {
  for (let i = indices.length - 1; i >= 0; i--) {
    const currentIndex = indices[i];
    const currentGroup = groups[i];

    if (currentIndex === undefined || !currentGroup) continue;

    indices[i] = currentIndex + 1;
    const newIndex = indices[i];
    if (newIndex !== undefined && newIndex < currentGroup.options.length) {
      return true;
    }
    indices[i] = 0;
  }
  return false;
};

// Utility to create unique IDs
export const createUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Utility to validate variant group structure
export const isValidVariantGroup = (group: VariantGroup): boolean => {
  return (
    group &&
    typeof group.id === "string" &&
    group.id.length > 0 &&
    typeof group.name === "string" &&
    Array.isArray(group.options) &&
    group.options.every(
      (option) =>
        option &&
        typeof option.id === "string" &&
        option.id.length > 0 &&
        typeof option.name === "string",
    )
  );
};

// Utility to find combination by variant selection
export const findCombinationBySelection = (
  combinations: VariantCombination[],
  selection: Record<string, string>,
): VariantCombination | undefined => {
  return combinations.find((combination) => {
    const keys = Object.keys(selection);
    return keys.every((key) => combination.combination[key] === selection[key]);
  });
};
