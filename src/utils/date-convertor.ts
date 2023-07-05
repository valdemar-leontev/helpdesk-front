const isoDateFormat = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+(?:[+-][0-2]\d:[0-5]\d|Z)$/;

function isIsoDateString(value: any): boolean {
  return value && typeof value === 'string' && isoDateFormat.test(value);
}

export function handleDates(obj: any) {
  if (obj === null || obj === undefined || typeof obj !== 'object')
    return obj;

  if (Array.isArray(obj)) {
    for (const objElement of obj) {
      handleDates(objElement);
    }
  } else {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (isIsoDateString(value)) obj[key] = new Date(value);
      else if (typeof value === 'object') handleDates(value);
    }
  }
}
