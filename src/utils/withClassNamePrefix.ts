export const withClassNamePrefix = (prefix: string) => {
  return (...classNames: (Record<string, any> | string | null | undefined)[]) => {
    const length = classNames.length;

    if (!length) return prefix;

    const names: string[] = [];
    const hasOwn = Object.prototype.hasOwnProperty;

    for (let i = 0; i < length; i += 1) {
      const value = classNames[i];
      if (typeof value === 'string') {
        value.split(/\s+/).forEach((name) => {
          if (name && names.indexOf(name) === -1) {
            names.push(name);
          }
        });
      } else if (value) {
        for (const name in value) {
          if (hasOwn.call(value, name) && value[name]) {
            if (name && names.indexOf(name) === -1) {
              names.push(name);
            }
          }
        }
      }
    }

    return names.map((name) => `${prefix}__${name}`).join(' ');
  };
};
