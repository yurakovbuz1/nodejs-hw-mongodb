import { SORT_ORDER } from '../constants/sortOrder.js';

function parseSortBy(param) {
  if (typeof param !== 'string') {
    return '_id';
  }

  const keys = [
    'name',
    '_id',
    'isFavourite',
    'phoneNumber',
    'email',
    'contactType',
  ];
  console.log(param);
  if (keys.includes(param)) {
    return param;
  }
  return '_id';
}

function parseSortOrder(order) {
  if (typeof order !== 'string') {
    return 'asc';
  }

  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(order.toLowerCase())) {
    return order.toLowerCase();
  }

  return 'asc';
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
