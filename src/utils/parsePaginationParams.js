function parsePagination(num, defaultValue) {
  if (typeof num !== 'string') {
    return defaultValue;
  }

  const parsedNum = parseInt(num);
  if (Number.isNaN(parsedNum) || parsedNum <= 0) {
    return defaultValue;
  }
  return parsedNum;
}

export function parsePaginationParams(query) {
  const { page, perPage } = query;

  const parsedPage = parsePagination(page, 1);
  const parsedPerPage = parsePagination(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
}
