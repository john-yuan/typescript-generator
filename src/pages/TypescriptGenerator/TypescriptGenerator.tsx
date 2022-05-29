import './TypescriptGenerator.scss';
import React from 'react';
import { withClassNamePrefix } from '../../utils/withClassNamePrefix';
import { toTypeDefinition } from '../../utils/toTypeDefinition';
const ns = withClassNamePrefix('page-TypescriptGenerator');

const defaultCode = JSON.stringify({
  code: 0,
  data: {
    list: [
      {
        id: 1,
        title: 'Create react Application...'
      }
    ],
    page: 1,
    size: 10,
  }
}, null, 2);

export interface Props {}

export const TypescriptGenerator: React.FC<Props> = () => {
  const [sourceCode, setSourceCode] = React.useState(defaultCode);

  const handleInput: React.ChangeEventHandler<HTMLTextAreaElement> = React.useCallback((e) => {
    setSourceCode(e.target.value);
  }, []);

  const result = React.useMemo(() => {
    if (sourceCode.trim()) {
      try {
        return {
          code: toTypeDefinition(JSON.parse(sourceCode)),
          highlight: toTypeDefinition(JSON.parse(sourceCode), {
            format: (type, value) => {
              return type === 'keyword'
                ? `<code data-type="${type}" data-keyword="${value}">${value}</code>`
                : `<code data-type="${type}">${value}</code>`;
            }
          })
        };
      } catch (err: any) {
        return err.toString();
      }
    }
    return ''
  }, [sourceCode]);

  return (
    <div className={ns('container')}>
      <div className={ns('input')}>
        <textarea
          value={sourceCode}
          onChange={handleInput}
          placeholder="Paste the response JSON here..."
        />
      </div>
      <div className={ns('border')}></div>
      <div className={ns('output')}>
        <div className={ns('result')}>
          <pre dangerouslySetInnerHTML={{
            __html: result.highlight
          }} />
        </div>
      </div>
    </div>
  );
};

