type Listener = () => void;

const listeners = new Set<Listener>();

export const rateLimitBus = {
	subscribe(listener: Listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},
	emit() {
		for (const listener of listeners) listener();
	},
};