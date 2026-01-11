import { vi } from "vitest";

type Listener = (event: Event) => void;

const listeners: Record<string, Set<Listener>> = {};

class MockCustomEvent<T = unknown> extends Event {
	detail?: T;
	constructor(type: string, eventInitDict?: CustomEventInit<T>) {
		super(type, eventInitDict);
		this.detail = eventInitDict?.detail;
	}
}

export function setupWindowMock() {
	const mockWindow = {
		addEventListener: vi.fn((type: string, listener: Listener) => {
			if (!listeners[type]) listeners[type] = new Set();
			listeners[type].add(listener);
		}),
		removeEventListener: vi.fn((type: string, listener: Listener) => {
			listeners[type]?.delete(listener);
		}),
		dispatchEvent: vi.fn((event: Event) => {
			listeners[event.type]?.forEach((listener) => listener(event));
			return true;
		}),
	};

	(global as unknown as { window: typeof mockWindow }).window = mockWindow;
	(global as unknown as { CustomEvent: typeof MockCustomEvent }).CustomEvent = MockCustomEvent;

	const clearListeners = () => {
		Object.values(listeners).forEach((set) => set.clear());
	};

	return { mockWindow, clearListeners };
}
