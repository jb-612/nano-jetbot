import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Copy,
  Check,
  Plug,
  PlugZap,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { ROBOT_ENDPOINTS, type ApiEndpoint } from '../data/robotEndpoints';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${METHOD_COLORS[method] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
    >
      {method}
    </span>
  );
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may fail in insecure contexts; ignore silently.
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded bg-gray-700/60 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CodeBlock
// ---------------------------------------------------------------------------

function CodeBlock({ content }: { content: string }) {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 overflow-x-auto font-mono text-sm leading-relaxed">
        {content}
      </pre>
      <CopyButton text={content} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// TryItPanel
// ---------------------------------------------------------------------------

interface TryItResponse {
  status: number;
  statusText: string;
  body: string;
}

function TryItPanel({ endpoint }: { endpoint: ApiEndpoint }) {
  const hasBody = endpoint.method === 'POST' || endpoint.method === 'PUT';
  const [body, setBody] = useState(
    hasBody && endpoint.requestBody ? formatJson(endpoint.requestBody.example) : '',
  );
  const [apiKey, setApiKey] = useState('dev-key-12345');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<TryItResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'X-API-Key': apiKey,
      };
      if (hasBody) {
        headers['Content-Type'] = 'application/json';
      }

      const fetchOptions: RequestInit = {
        method: endpoint.method,
        headers,
      };
      if (hasBody && body.trim()) {
        fetchOptions.body = body;
      }

      const res = await fetch(endpoint.path, fetchOptions);
      const text = await res.text();

      let formatted: string;
      try {
        formatted = formatJson(JSON.parse(text));
      } catch {
        formatted = text;
      }

      setResponse({ status: res.status, statusText: res.statusText, body: formatted });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        Try It
      </button>

      {open && (
        <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
          {/* API Key */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              X-API-Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
          </div>

          {/* Request body */}
          {hasBody && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Request Body (JSON)
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={Math.min(body.split('\n').length + 1, 12)}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono resize-y"
              />
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Request
          </button>

          {/* Response */}
          {response && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Response
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                    response.status >= 200 && response.status < 300
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : response.status >= 400
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}
                >
                  {response.status} {response.statusText}
                </span>
              </div>
              <CodeBlock content={response.body} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EndpointCard
// ---------------------------------------------------------------------------

function EndpointCard({ endpoint, id }: { endpoint: ApiEndpoint; id: string }) {
  const schema = endpoint.requestBody?.schema as
    | { properties?: Record<string, Record<string, unknown>>; required?: string[] }
    | undefined;

  return (
    <div
      id={id}
      className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
        <MethodBadge method={endpoint.method} />
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
          {endpoint.path}
        </span>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* Summary & description */}
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
            {endpoint.summary}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {endpoint.description}
          </p>
        </div>

        {/* Headers table */}
        {endpoint.headers.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Headers
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                      Name
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                      Required
                    </th>
                    <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.headers.map((h) => (
                    <tr key={h.name} className="border-b border-gray-50 dark:border-gray-800/50">
                      <td className="py-2 pr-4 font-mono text-xs text-gray-900 dark:text-white">
                        {h.name}
                      </td>
                      <td className="py-2 pr-4">
                        {h.required ? (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            required
                          </span>
                        ) : (
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            optional
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-gray-600 dark:text-gray-400 text-xs">
                        {h.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request body */}
        {endpoint.requestBody && schema?.properties && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Request Body
              <span className="ml-2 font-normal normal-case text-gray-400 dark:text-gray-500">
                {endpoint.requestBody.contentType}
              </span>
            </h4>

            {/* Schema properties table */}
            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                      Property
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                      Type
                    </th>
                    <th className="text-left py-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                      Required
                    </th>
                    <th className="text-left py-2 font-medium text-gray-500 dark:text-gray-400">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(schema.properties).map(([propName, propDef]) => {
                    const required = Array.isArray(schema.required) && schema.required.includes(propName);
                    const typeStr = String(propDef.type ?? 'any');
                    const enumValues = propDef.enum as string[] | undefined;
                    const desc = String(propDef.description ?? '');
                    return (
                      <tr
                        key={propName}
                        className="border-b border-gray-50 dark:border-gray-800/50"
                      >
                        <td className="py-2 pr-4 font-mono text-xs text-gray-900 dark:text-white">
                          {propName}
                        </td>
                        <td className="py-2 pr-4 font-mono text-xs text-purple-600 dark:text-purple-400">
                          {typeStr}
                          {enumValues && (
                            <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                              {enumValues.map((v) => `"${v}"`).join(' | ')}
                            </span>
                          )}
                        </td>
                        <td className="py-2 pr-4">
                          {required ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                              required
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                              optional
                            </span>
                          )}
                        </td>
                        <td className="py-2 text-gray-600 dark:text-gray-400 text-xs">{desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Example */}
            <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Example</h5>
            <CodeBlock content={formatJson(endpoint.requestBody.example)} />
          </div>
        )}

        {/* Response example */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Response Example
          </h4>
          <CodeBlock content={formatJson(endpoint.responseExample)} />
        </div>

        {/* Try It */}
        <TryItPanel endpoint={endpoint} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WebSocketTester
// ---------------------------------------------------------------------------

interface WsFrame {
  id: number;
  timestamp: string;
  content: string;
}

function WebSocketTester() {
  const [url, setUrl] = useState('ws://localhost:4000/ws/telemetry');
  const [connected, setConnected] = useState(false);
  const [frames, setFrames] = useState<WsFrame[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const frameCountRef = useRef(0);
  const [open, setOpen] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [frames, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleConnect = () => {
    setError(null);
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        frameCountRef.current += 1;
        const now = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 });
        let content: string;
        try {
          content = formatJson(JSON.parse(event.data));
        } catch {
          content = String(event.data);
        }
        setFrames((prev) => [...prev, { id: frameCountRef.current, timestamp: now, content }]);
      };

      ws.onerror = () => {
        setError('WebSocket error occurred');
      };

      ws.onclose = (event) => {
        setConnected(false);
        if (event.code !== 1000) {
          setError(`Connection closed: ${event.reason || 'unknown reason'} (code ${event.code})`);
        }
      };
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnect');
      wsRef.current = null;
    }
    setConnected(false);
  };

  const handleClear = () => {
    setFrames([]);
    frameCountRef.current = 0;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {open ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          WS
        </span>
        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
          /ws/telemetry
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">WebSocket Tester</span>
        {connected && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Connected
          </span>
        )}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          {/* URL + buttons */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={connected}
              className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono disabled:opacity-50"
              placeholder="ws://localhost:4000/ws/telemetry"
            />
            {!connected ? (
              <button
                onClick={handleConnect}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
              >
                <Plug className="w-4 h-4" />
                Connect
              </button>
            ) : (
              <button
                onClick={handleDisconnect}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                <PlugZap className="w-4 h-4" />
                Disconnect
              </button>
            )}
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
              title="Clear messages"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Frame counter */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {frames.length} frame{frames.length !== 1 ? 's' : ''} received
          </div>

          {/* Message log */}
          <div
            ref={logRef}
            className="h-64 overflow-y-auto bg-gray-900 dark:bg-gray-950 rounded-lg p-3 space-y-2 font-mono text-xs"
          >
            {frames.length === 0 && (
              <p className="text-gray-500 italic">
                {connected ? 'Waiting for messages...' : 'Connect to start receiving frames.'}
              </p>
            )}
            {frames.map((frame) => (
              <div key={frame.id} className="border-b border-gray-800 pb-2">
                <span className="text-gray-500">[{frame.timestamp}]</span>
                <span className="text-gray-400 ml-2">#{frame.id}</span>
                <pre className="text-green-400 mt-1 whitespace-pre-wrap break-all">
                  {frame.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left Navigation
// ---------------------------------------------------------------------------

function EndpointNav({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className="space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
        Endpoints
      </h3>
      {ROBOT_ENDPOINTS.map((ep, idx) => {
        const id = `endpoint-${idx}`;
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm transition-colors ${
              isActive
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <MethodBadge method={ep.method} />
            <span className="font-mono text-xs truncate">{ep.path}</span>
          </button>
        );
      })}

      {/* WebSocket entry */}
      <button
        onClick={() => onSelect('ws-tester')}
        className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm transition-colors ${
          activeId === 'ws-tester'
            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          WS
        </span>
        <span className="font-mono text-xs truncate">/ws/telemetry</span>
      </button>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// RobotApiPage
// ---------------------------------------------------------------------------

export const RobotApiPage: React.FC = () => {
  const [activeId, setActiveId] = useState('endpoint-0');
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (id: string) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      // Scroll the content panel so the selected element is visible.
      const containerTop = contentRef.current.getBoundingClientRect().top;
      const elementTop = el.getBoundingClientRect().top;
      contentRef.current.scrollTo({
        top: contentRef.current.scrollTop + (elementTop - containerTop) - 16,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex gap-6 h-full min-h-0">
      {/* Left sidebar - 20% */}
      <div className="w-1/5 min-w-[180px] max-w-[260px] shrink-0 overflow-y-auto pr-2 border-r border-gray-200 dark:border-gray-700">
        <EndpointNav activeId={activeId} onSelect={handleSelect} />
      </div>

      {/* Right content - 80% */}
      <div ref={contentRef} className="flex-1 overflow-y-auto space-y-6 pb-8">
        {/* Page header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            API Documentation
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Interactive reference for the JetBot REST API and WebSocket endpoints. Use the Try It
            panels to send live requests.
          </p>
        </div>

        {/* Endpoint cards */}
        {ROBOT_ENDPOINTS.map((ep, idx) => (
          <EndpointCard key={idx} endpoint={ep} id={`endpoint-${idx}`} />
        ))}

        {/* WebSocket tester */}
        <div id="ws-tester">
          <WebSocketTester />
        </div>
      </div>
    </div>
  );
};
