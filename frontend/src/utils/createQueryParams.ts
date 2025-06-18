const createQueryParams = (query: Record<string, unknown>) => {
    const params: URLSearchParams = new URLSearchParams();
    for (const key of Object.keys(query)) {
        if (query[key]) { // Check if the value is truthy
            if (query[key] instanceof Array) { // Check if the value is an array
                (query[key] as unknown[]).forEach((item) => {
                    params.append(`${key.toString()}`, String(item)); // Append each item in the array
                });
            } else {
                params.append(key.toString(), String(query[key])); // Append single value
            }
        }
    }
    return String(params); // Use String(params) or params.toString() - both work
};

export default createQueryParams;
