import './TypescriptGenerator.scss';
import React from 'react';
import { withClassNamePrefix } from '../../utils/withClassNamePrefix';
import { toTypeDefinition } from '../../utils/toTypeDefinition';
import { copyToClipboard } from '../../utils/copyToClipboard';

const ns = withClassNamePrefix('page-TypescriptGenerator');
const KEY = 'TypescriptGenerator.input';

export interface Props {}

export const TypescriptGenerator: React.FC<Props> = () => {
  const [sourceCode, setSourceCode] = React.useState(() => {
    return sessionStorage.getItem(KEY) || '';
  });

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
          }),
          error: ''
        };
      } catch (err: any) {
        return {
          highlight: '',
          code: '',
          error: err.toString()
        };
      }
    }
    return {
      code: '',
      highlight: '',
      error: ''
    }
  }, [sourceCode]);

  React.useEffect(() => {
    sessionStorage.setItem(KEY, sourceCode);
  }, [sourceCode]);

  const [copyStatus, setCopyStatus] = React.useState<'success' | 'error' | 'initial'>('initial');
  const timerIdRef = React.useRef<{ id?: number; }>({});

  return (
    <div className={ns('container')}>
      <div className={ns('heading')}>
        <h1>Typescript Generator</h1>
        <p>A devtool to generate TypeScript code from the response body JSON of RESTful APIs automatically.</p>
      </div>
      <div className={ns('main')}>
        <div className={ns('section')}>
          <div className={ns('toolbar')}>
            <button
              type="button"
              onClick={() => {
                try {
                  const beautified = JSON.stringify(JSON.parse(sourceCode), null, 2);
                  setSourceCode(beautified);
                } catch (err) {
                  // nothing
                }
              }}
            >Beautify</button>
          </div>
          <div className={ns('content')}>
            <textarea
              className={ns('input')}
              value={sourceCode}
              onChange={handleInput}
              placeholder="Paste the response body JSON here..."
            />
          </div>
        </div>
        <div className={ns('sep')}></div>
        <div className={ns('section')}>
          <div className={ns('toolbar')}>
            <button
              type="button"
              onClick={() => {
                setCopyStatus('initial');

                if (timerIdRef.current.id !== undefined) {
                  clearTimeout(timerIdRef.current.id);
                }

                copyToClipboard(result.code).then((success) => {
                  if (success) {
                    setCopyStatus('success');
                    timerIdRef.current.id = window.setTimeout(() => {
                      setCopyStatus('initial');
                      timerIdRef.current.id = undefined;
                    }, 2000);
                  } else {
                    setCopyStatus('error');
                  }
                });
              }}
            >
              {copyStatus === 'initial' && 'Copy'}
              {copyStatus === 'success' && 'Copied'}
              {copyStatus === 'error' && 'Failed to copy'}
            </button>
          </div>
          <div className={ns('content')}>
            <pre
              className={ns('output')}
              dangerouslySetInnerHTML={{
                __html: result.error || result.highlight
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

