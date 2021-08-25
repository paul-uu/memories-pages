export const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

export const isObjEmpty = (obj: object): boolean =>
  Object.keys(obj).length === 0;
