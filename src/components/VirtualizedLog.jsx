// ============================================
// Virtualized Log Component
// Efficiently renders large log lists using windowing
// ============================================

import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import { COLORS } from '../constants/colors.js';

/**
 * Individual log entry component
 */
const LogEntry = memo(({ log, style }) => (
  <div style={{ ...styles.logEntry, ...style }}>
    <span style={styles.logTime}>[{log.time}]</span>
    <span style={styles.logMessage}>{log.message}</span>
  </div>
));

LogEntry.displayName = 'LogEntry';

/**
 * VirtualizedLog - Efficiently renders large log lists
 * Only renders items visible in the viewport plus a buffer
 *
 * @param {Array} logs - Array of log objects { time, message }
 * @param {number} itemHeight - Height of each log item (default: 24)
 * @param {number} maxHeight - Maximum height of container (default: 300)
 * @param {number} overscan - Number of items to render outside viewport (default: 5)
 * @param {boolean} autoScroll - Auto-scroll to bottom on new items (default: true)
 */
const VirtualizedLog = ({
  logs = [],
  itemHeight = 24,
  maxHeight = 300,
  overscan = 5,
  autoScroll = true,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(maxHeight);
  const prevLogsLengthRef = useRef(logs.length);

  // Calculate visible range
  const totalHeight = logs.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * overscan;
  const endIndex = Math.min(logs.length - 1, startIndex + visibleCount);

  // Handle scroll
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (autoScroll && logs.length > prevLogsLengthRef.current && containerRef.current) {
      containerRef.current.scrollTop = totalHeight;
    }
    prevLogsLengthRef.current = logs.length;
  }, [logs.length, autoScroll, totalHeight]);

  // Measure container height on mount/resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // If no logs, show empty state
  if (logs.length === 0) {
    return null;
  }

  // Generate visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const log = logs[i];
    if (log) {
      visibleItems.push(
        <LogEntry
          key={i}
          log={log}
          style={{
            position: 'absolute',
            top: i * itemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          }}
        />
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...styles.container,
        maxHeight,
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          position: 'relative',
          height: totalHeight,
          minHeight: '100%',
        }}
      >
        {visibleItems}
      </div>

      {/* Log stats footer */}
      <div style={styles.footer}>
        <span style={styles.footerText}>
          {logs.length} log entries
          {logs.length > 100 && ' (virtualized)'}
        </span>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    backgroundColor: '#1E293B',
    borderRadius: '10px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    fontSize: '13px',
    overflow: 'auto',
    marginTop: '16px',
  },
  logEntry: {
    display: 'flex',
    gap: '8px',
    padding: '0 16px',
    alignItems: 'center',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  logTime: {
    color: '#64748B',
    flexShrink: 0,
  },
  logMessage: {
    color: '#94A3B8',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  footer: {
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '8px 16px',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderTop: '1px solid #334155',
  },
  footerText: {
    fontSize: '11px',
    color: '#64748B',
  },
};

// Export memoized version
export default memo(VirtualizedLog);

/**
 * Simple ProcessingLog component (non-virtualized)
 * Use this for small log lists (< 100 items)
 */
export const SimpleProcessingLog = memo(({ logs }) => {
  if (!logs || logs.length === 0) return null;

  return (
    <div style={simpleStyles.container}>
      {logs.map((log, index) => (
        <div key={index} style={simpleStyles.entry}>
          <span style={simpleStyles.time}>[{log.time}]</span>
          <span style={simpleStyles.message}>{log.message}</span>
        </div>
      ))}
    </div>
  );
});

SimpleProcessingLog.displayName = 'SimpleProcessingLog';

const simpleStyles = {
  container: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#1E293B',
    borderRadius: '10px',
    fontFamily: '"SF Mono", "Menlo", "Monaco", monospace',
    fontSize: '13px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  entry: {
    color: '#94A3B8',
    marginBottom: '4px',
  },
  time: {
    color: '#64748B',
    marginRight: '8px',
  },
  message: {
    color: '#94A3B8',
  },
};
