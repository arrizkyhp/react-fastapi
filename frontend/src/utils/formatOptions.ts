/**
 * Represents a generic option object with a value and a label.
 */


import {SelectOption} from "@/types/common.ts";

/**
 * Transforms an array of objects into an array of Option objects (value-label pairs).
 *
 * @template T The type of the objects in the input array.
 * @param {T[] | undefined | null} items The array of items to transform. Can be undefined or null.
 * @param {keyof T} valueKey The key from the item object to use as the `value` in the Option.
 * @param {keyof T} labelKey The key from the item object to use as the `label` in the Option.
 * @returns {Option[]} An array of formatted Option objects. Returns an empty array if `items` is undefined or null.
 */
const formatOptions = <T>(
    items: T[] | undefined | null,
    valueKey: keyof T,
    labelKey: keyof T,
): SelectOption[] => {
    if (!items) {
        return [];
    }

    return items.map((item) => ({
        value: String(item[valueKey]), // Ensure value is a string
        label: String(item[labelKey]), // Ensure label is a string
    }));
};

export default formatOptions;
