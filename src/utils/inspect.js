import { createBrowserInspector } from '@statelyai/inspect';

// Create inspector once when app loads, shared by all components
let inspector = null;

export function getInspector() {
  if (!inspector) {
    try {
      inspector = createBrowserInspector();
      console.log('✅ @statelyai/inspect initialized - popup should be opened');
    } catch (error) {
      console.warn('⚠️ @statelyai/inspect initialization failed:', error);
      return undefined;
    }
  }
  return inspector.inspect;
}
