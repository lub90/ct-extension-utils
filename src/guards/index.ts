// Node only (uses node:fs): import from `ct-extension-utils/guards` in tests, never from the browser entry.
export { HOST_UTILITIES, hostClassViolations } from './host-classes';
export { motionViolations } from './motion';
