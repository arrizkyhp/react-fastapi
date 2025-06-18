const generateAbbreviation = (roleName: string): string => {
    // Split the role name by spaces
    const words = roleName.split(" ");

    // Map each word to its first character (uppercased) and join them
    return words
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
};

export default generateAbbreviation;
