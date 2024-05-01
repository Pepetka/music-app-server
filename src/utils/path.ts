export const getPathWithQueryParameters = (
  path: string,
  query: Record<string, string>,
): string => {
  return `${path}?${new URLSearchParams(query).toString()}`;
};
