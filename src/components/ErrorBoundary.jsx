import { Component } from 'react';

/**
 * Top-level ErrorBoundary — catches any render error in the tree and shows a
 * fallback screen instead of a blank page. Only handles render + lifecycle
 * errors; async errors inside event handlers still need try/catch in the
 * callsite (that's a React limitation, not this component's).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // In production this is where you'd ship the error to Sentry/Datadog/etc.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', background: 'var(--bg)'
      }}>
        <div style={{
          maxWidth: 520, background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '2rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>⚠️</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 20 }}>
            The page hit an unexpected error. This isn't your fault. You can try again, or reload the page.
          </p>
          <details style={{
            fontSize: 11, color: 'var(--text-3)', textAlign: 'left', marginBottom: 20,
            background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px'
          }}>
            <summary style={{ cursor: 'pointer', outline: 'none' }}>Technical details</summary>
            <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace' }}>
              {String(this.state.error?.message || this.state.error)}
            </pre>
          </details>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={this.handleReset}>Try again</button>
            <button className="btn btn-white btn-sm" onClick={this.handleReload}>Reload page</button>
          </div>
        </div>
      </div>
    );
  }
}
