export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const withBasePath = (path) => `${BASE_PATH}${path}`;
