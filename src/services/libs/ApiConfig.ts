export const API_URLS = {
  Base: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000").replace(
    /\/$/,
    "",
  ),
};
