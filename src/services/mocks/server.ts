/**
 * Odysseus Bank - MSW Server Setup
 * Mock server configuration for React Native
 */

import { setupServer } from 'msw/native';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

export default server;
