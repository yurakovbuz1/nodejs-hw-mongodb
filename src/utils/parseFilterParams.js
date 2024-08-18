function parseTypeFilter(type) {
  if (typeof type !== 'string') {
    return undefined;
  }
  const keys = ['work', 'home', 'personal'];
  if (keys.includes(type)) {
    return type;
  }
  return undefined;
}

function parseIsFavourite(isFavourite) {
  if (typeof isFavourite !== 'string') {
    return undefined;
  }
  if (isFavourite === 'true') {
    return true;
  }
  if (isFavourite === 'false') {
    return false;
  }
  return undefined;
}

export function parseFilterParams(filter) {
  const { type, isFavourite } = filter;
  const parsedType = parseTypeFilter(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
}
