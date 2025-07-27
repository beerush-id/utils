import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logger } from '../../lib/index.js';

describe('Logger Utilities', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should log info messages', () => {
    logger.info('Test message');
    expect(console.log).toHaveBeenCalledWith('ℹ️ \x1b[32mTest message\x1b[0m');
  });

  it('should log warning messages', () => {
    logger.warn('Test warning');
    expect(console.warn).toHaveBeenCalledWith('⚠️ \x1b[33mTest warning\x1b[0m');
  });

  it('should log error messages', () => {
    logger.error('Test error');
    expect(console.error).toHaveBeenCalledWith('❌  \x1b[31mTest error\x1b[0m');
  });

  describe('Debug Mode', () => {
    it('should not log debug messages when debug is disabled', () => {
      logger.setDebug(false);
      logger.debug('Test debug');
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('should log debug messages when debug is enabled', () => {
      logger.setDebug(true);
      logger.debug('Test debug');
      expect(console.debug).toHaveBeenCalledWith('🐞 \x1b[34mTest debug\x1b[0m');
    });

    it('should use console.trace when stack is enabled', () => {
      vi.spyOn(console, 'trace').mockImplementation(() => {});
      logger.setDebug(true, true);
      logger.debug('Test debug');
      expect(console.trace).toHaveBeenCalledWith('🐞 \x1b[34mTest debug\x1b[0m');
    });
  });
});
