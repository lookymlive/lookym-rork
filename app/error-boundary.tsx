import React, { Component, ReactNode } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

const IFRAME_ID = 'fork-web-preview';

const webTargetPostOrigins = [
  'https://localhost:3000',
  'https://appetize.io',
  'https://from.app',
];

function sendErrorToIframe(error: any, errorInfo: any) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    (window as any).sendErrorToParent?.({
      source: 'app',
      error,
      referrer: document.referrer,
    });
  }

  const errorMessage = {
    source: 'app',
    error: error?.message || error?.toString() || 'Unknown error',
    stack: error?.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    iframeId: IFRAME_ID,
  };

  try {
    window.parent.postMessage(
      errorMessage,
      webTargetPostOrigins.includes(document.referrer) ? document.referrer : '*'
    );
  } catch (postMessageError) {
    console.error('Failed to send error to parent', postMessageError);
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    (window as any)._handleRuntimeError?.(error, {
      message: error?.message || 'Unknown error',
      name: error?.name || 'Unknown',
      lineNumber: error?.lineNumber || 'Unknown line',
      columnNumber: error?.columnNumber || 'Unknown column',
      unhandled: true,
    });
  }

  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    sendErrorToIframe(event.reason, {
      componentStack: 'Unhandled Promise rejection',
    });
  });

  const originalConsoleError = console.error;
  console.error = (...args) => {
    sendErrorToIframe(args.join(' '), {});
    originalConsoleError.apply(console, args);
  };
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    sendErrorToIframe(error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.subtitle}>{this.state.error?.message}</Text>
            {Platform.OS === 'web' && (
              <Text style={styles.description}>
                Please check your device logs for more details.
              </Text>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ErrorBoundary;