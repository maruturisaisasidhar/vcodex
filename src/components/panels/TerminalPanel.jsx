import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

const TerminalPanel = ({ ws }) => {
  const terminalRef = useRef(null);
  const termRef = useRef(null);
  const inputListenerRef = useRef(null);
  const currentLineRef = useRef('');

  // Initialize terminal once
  useEffect(() => {
    if (terminalRef.current && !termRef.current) {
      const term = new Terminal({
        cursorBlink: true,
        fontFamily: 'Fira Code, monospace',
        fontSize: 13,
        theme: {
          background: '#111827',
          foreground: '#d1d5db',
          cursor: '#60a5fa',
        },
      });

      term.open(terminalRef.current);
      termRef.current = term;

      term.writeln('Welcome to V-CodeX Terminal!');
      term.write('>> ');
    }
  }, []);

  // Handle WebSocket messages and input logic
  useEffect(() => {
    const term = termRef.current;
    if (!term || !ws) return;

    // ✅ Clear terminal for a fresh session
    term.clear();
    term.write('>> ');
    currentLineRef.current = '';

    // Handle incoming WebSocket messages
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (['output', 'error', 'exit'].includes(message.type)) {
          term.write(message.data.replace(/\n/g, '\r\n'));
        }
      } catch (err) {
        console.error('Invalid message from WebSocket:', event.data,err);
      }
    };

    // Clean up previous listener if exists
    if (inputListenerRef.current) {
      inputListenerRef.current.dispose();
    }

    // Handle terminal input
    inputListenerRef.current = term.onData((data) => {
      let currentLine = currentLineRef.current;

      if (data === '\r') { // Enter
        term.writeln('');
        const trimmed = currentLine.trim();

        if (trimmed === 'clear') {
          term.clear();
        } else if (trimmed) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'input', data: currentLine + '\n' }));
          } else {
            term.writeln(`> command not found: ${trimmed}`);
          }
        }

        term.write('>> ');
        currentLineRef.current = '';
      } else if (data === '\x7F') { // Backspace
        if (currentLine.length > 0) {
          term.write('\b \b');
          currentLineRef.current = currentLine.slice(0, -1);
        }
      } else {
        currentLineRef.current += data;
        term.write(data);
      }
    });

    // Cleanup on WebSocket or component change
    return () => {
      if (inputListenerRef.current) {
        inputListenerRef.current.dispose();
      }
    };
  }, [ws]);

  return <div ref={terminalRef} className="h-full w-full p-2" />;
};

export default TerminalPanel;
