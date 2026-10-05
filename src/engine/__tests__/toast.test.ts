// Tests for the toast pub/sub engine.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock sound engine (no AudioContext in test env)
vi.mock('../sound', () => ({
  playSound: vi.fn(),
}));

// We use dynamic import + resetModules to get a fresh module state per test.
// The toast engine uses module-level state (toasts array, nextId, subscribers).

type ToastModule = typeof import('../toast');
let toast: ToastModule;

describe('toast', () => {
  let unsub: (() => void) | null = null;

  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    toast = await import('../toast');
  });

  afterEach(() => {
    if (unsub) {
      unsub();
      unsub = null;
    }
    vi.useRealTimers();
  });

  it('showToast notifies subscribers with the new toast', () => {
    const received: import('../toast').ToastItem[][] = [];
    unsub = toast.subscribeToasts((toasts) => received.push(toasts));

    toast.showToast('Hello', 'success');

    // subscribeToasts sends current state immediately (empty), then showToast notifies
    expect(received.length).toBe(2);
    expect(received[0]).toHaveLength(0); // initial empty state
    expect(received[1]).toHaveLength(1);
    expect(received[1][0].message).toBe('Hello');
    expect(received[1][0].type).toBe('success');
  });

  it('auto-dismisses after 3 seconds', () => {
    const received: import('../toast').ToastItem[][] = [];
    unsub = toast.subscribeToasts((toasts) => received.push(toasts));

    toast.showToast('Temp', 'warning');
    expect(received[received.length - 1]).toHaveLength(1);

    vi.advanceTimersByTime(2999);
    expect(received[received.length - 1]).toHaveLength(1); // still there

    vi.advanceTimersByTime(1);
    expect(received[received.length - 1]).toHaveLength(0); // gone
  });

  it('multiple toasts stack with unique IDs', () => {
    const received: import('../toast').ToastItem[][] = [];
    unsub = toast.subscribeToasts((toasts) => received.push(toasts));

    toast.showToast('First');
    toast.showToast('Second');
    toast.showToast('Third');

    const latest = received[received.length - 1]!;
    expect(latest).toHaveLength(3);
    expect(latest[0].id).not.toBe(latest[1].id);
    expect(latest[1].id).not.toBe(latest[2].id);
    expect(latest[0].message).toBe('First');
    expect(latest[2].message).toBe('Third');
  });

  it('unsubscribe stops receiving updates', () => {
    const received: import('../toast').ToastItem[][] = [];
    unsub = toast.subscribeToasts((toasts) => received.push(toasts));
    const countAfterSub = received.length;

    unsub!();
    unsub = null;

    toast.showToast('After unsub');

    // No new notification received
    expect(received.length).toBe(countAfterSub);
  });

  it('default type is success', () => {
    const received: import('../toast').ToastItem[][] = [];
    unsub = toast.subscribeToasts((toasts) => received.push(toasts));

    toast.showToast('Default');

    expect(received[received.length - 1]![0].type).toBe('success');
  });

  it('supports error and warning types', () => {
    const received: import('../toast').ToastItem[][] = [];
    unsub = toast.subscribeToasts((toasts) => received.push(toasts));

    toast.showToast('Bad', 'error');
    toast.showToast('Careful', 'warning');

    const latest = received[received.length - 1]!;
    expect(latest[0].type).toBe('error');
    expect(latest[1].type).toBe('warning');
  });

  it('toasts dismiss independently', () => {
    const received: import('../toast').ToastItem[][] = [];
    unsub = toast.subscribeToasts((toasts) => received.push(toasts));

    toast.showToast('A');
    vi.advanceTimersByTime(3000);
    expect(received[received.length - 1]).toHaveLength(0); // A is gone

    toast.showToast('B');
    toast.showToast('C');
    expect(received[received.length - 1]).toHaveLength(2);

    vi.advanceTimersByTime(3000);
    expect(received[received.length - 1]).toHaveLength(0); // both B and C gone
  });
});
