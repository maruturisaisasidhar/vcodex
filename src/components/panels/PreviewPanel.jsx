import React, { useState, useEffect } from 'react';
import * as Babel from '@babel/standalone';

const isReactCode = (code) => {
  // Detect React import or JSX usage
  return /from\s+['"]react['"]|<\w+/.test(code);
};

const createReactPreview = (code) => {
  try {
    const transformedCode = Babel.transform(code, {
      presets: ['react', 'env'],
      plugins: ['transform-modules-umd'],
    }).code;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>React Preview</title>
        <style>body { margin: 0; padding: 0; }</style>
        <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script>
          try {
            ${transformedCode}
            ReactDOM.render(
              React.createElement(App),
              document.getElementById('root')
            );
          } catch (err) {
            document.body.innerHTML = '<pre style="color:red;">' + err.message + '</pre>';
          }
        </script>
      </body>
      </html>
    `;
  } catch (e) {
    return `
      <pre style="color:red;">Babel transform error: ${e.message}</pre>
    `;
  }
};

const PreviewPanel = ({ html = '', css = '', js = '' }) => {
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    if (isReactCode(html + js)) {
      // Combine JS + HTML as React component source
      const reactCode = `${js}\n${html}`;
      const preview = createReactPreview(reactCode);
      setSrcDoc(preview);
    } else {
      // Plain HTML/CSS/JS preview
      const combinedSrc = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>
              try {
                ${js}
              } catch (err) {
                document.body.innerHTML = '<pre style="color:red;">' + err.message + '</pre>';
              }
            </script>
          </body>
        </html>
      `;
      setSrcDoc(combinedSrc);
    }
  }, [html, css, js]);

  return (
    <div className="h-full w-full bg-white">
      <iframe
        srcDoc={srcDoc}
        title="Live Preview"
        sandbox="allow-scripts"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default PreviewPanel;
