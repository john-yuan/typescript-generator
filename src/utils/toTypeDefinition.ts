export const toTypeDefinition = (
  sample: any,
  options: {
    format?: (
      type: 'keyword' | 'identifier' | 'operator' | 'key' | 'type',
      value: string
    ) => string;
    indentSize?: number;
    preferType?: boolean;
    typeName?: string;
  } = {}
) => {
  const repeat = (count: number, value: string) => {
    let result = '';
    for (let i = 0; i < count; i += 1) {
      result += value;
    }
    return result;
  };

  const format: typeof options.format = (type, value) => {
    return options.format ? options.format(type, value) : value;
  };

  const TAB = repeat(options.indentSize || 2, ' ');
  const OP_LEFT_BRACE = format('operator', '{');
  const OP_RIGHT_BRACE = format('operator', '}');
  const OP_COLON = format('operator', ':');
  const OP_SEMI = format('operator', ';');
  const OP_BRACKETS = format('operator', '[]');

  const getType = (value: any, indent: number): string => {
    if (value === null || value === undefined) {
      return format('type', 'unknown');
    }

    if (typeof value === 'number') {
      return format('type', 'number');
    }

    if (typeof value === 'string') {
      return format('type', 'string');
    }

    if (typeof value === 'boolean') {
      return format('type', 'boolean');
    }

    if (Array.isArray(value)) {
      return `${getType(value[0], indent)}${OP_BRACKETS}`;
    }

    if (value) {
      const props = [OP_LEFT_BRACE];
      const currentIndent = repeat(indent, TAB);

      Object.keys(value)
        .forEach(key => {
          props.push(`${currentIndent}` +
            `${format('key', key)}` +
            `${OP_COLON} `+
            `${getType(value[key], indent + 1)}` +
            `${OP_SEMI}`);
        });

      props.push(`${repeat(indent - 1, TAB)}${OP_RIGHT_BRACE}`);

      return props.join('\n');
    }

    return format('type', 'unknown');
  };

  const EXPORT = format('keyword', 'export');
  const IDENTIFIER = format('identifier', options.typeName || 'Unnamed');
  const BODY = getType(sample, 1);

  if (options.preferType || Array.isArray(sample)) {
    const TYPE = format('keyword', 'type');
    const OP_EQ = format('operator', '=');
    return `${EXPORT} ${TYPE} ${IDENTIFIER} ${OP_EQ} ${BODY}${OP_SEMI}`
  }

  const INTERFACE = format('keyword', 'interface');

  return `${EXPORT} ${INTERFACE} ${IDENTIFIER} ${BODY}`;
};
