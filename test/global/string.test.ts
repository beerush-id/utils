import { describe, expect, it } from 'vitest';
import {
  base64,
  base64Decode,
  capitalize,
  cleanPath,
  dashify,
  humanize,
  makePath,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from '../../lib/index.js';

describe('String Utilities', () => {
  describe('Case Conversions', () => {
    it('should convert to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
      expect(toCamelCase('Hello World')).toBe('helloWorld');
    });

    it('should handle edge cases for camelCase conversion', () => {
      expect(toCamelCase('')).toBe('');
      expect(toCamelCase('hello')).toBe('hello');
      expect(toCamelCase('hello-world-test')).toBe('helloWorldTest');
      expect(toCamelCase('HELLO_WORLD')).toBe('helloWorld');
      expect(toCamelCase('Hello-World_Test')).toBe('helloWorldTest');
    });

    it('should convert to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('HelloWorld')).toBe('hello-world');
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    it('should handle edge cases for kebab-case conversion', () => {
      expect(toKebabCase('')).toBe('');
      expect(toKebabCase('hello')).toBe('hello');
      expect(toKebabCase('HelloWorldTest')).toBe('hello-world-test');
      expect(toKebabCase('hello world test')).toBe('hello-world-test');
      expect(toKebabCase('HELLO_WORLD_TEST')).toBe('hello-world-test');
    });

    it('should convert to PascalCase', () => {
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
      expect(toPascalCase('hello world')).toBe('HelloWorld');
    });

    it('should handle edge cases for PascalCase conversion', () => {
      expect(toPascalCase('')).toBe('');
      expect(toPascalCase('hello')).toBe('Hello');
      expect(toPascalCase('hello-world-test')).toBe('HelloWorldTest');
      expect(toPascalCase('HELLO_WORLD')).toBe('HelloWorld');
      expect(toPascalCase('Hello-world_Test')).toBe('HelloWorldTest');
    });

    it('should convert to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('HelloWorld')).toBe('hello_world');
      expect(toSnakeCase('hello-world')).toBe('hello_world');
    });

    it('should handle edge cases for snake_case conversion', () => {
      expect(toSnakeCase('')).toBe('');
      expect(toSnakeCase('hello')).toBe('hello');
      expect(toSnakeCase('HelloWorldTest')).toBe('hello_world_test');
      expect(toSnakeCase('hello world test')).toBe('hello_world_test');
      expect(toSnakeCase('HELLO-WORLD-TEST')).toBe('hello_world_test');
    });

    it('should capitalize text', () => {
      expect(capitalize('hello world')).toBe('Hello World');
      expect(capitalize('hello-world')).toBe('Hello-World');
    });

    it('should handle edge cases for capitalization', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO WORLD')).toBe('Hello World');
      expect(capitalize('hELLo WoRLd')).toBe('Hello World');
      expect(capitalize('hello-world-test')).toBe('Hello-World-Test');
    });
  });

  describe('Text Formatting', () => {
    it('should humanize text', () => {
      expect(humanize('hello-world')).toBe('hello world');
      expect(humanize('hello_world')).toBe('hello world');
      expect(humanize('hello-world', true)).toBe('Hello World');
    });

    it('should handle edge cases for humanization', () => {
      expect(humanize('')).toBe('');
      expect(humanize('hello')).toBe('hello');
      expect(humanize('hello-world-test')).toBe('hello world test');
      expect(humanize('hello_world_test', true)).toBe('Hello World Test');
    });

    it('should dashify text', () => {
      expect(dashify('helloWorld')).toBe('hello-world');
      expect(dashify('HelloWorld')).toBe('hello-world');
    });

    it('should handle edge cases for dashification', () => {
      expect(dashify('')).toBe('');
      expect(dashify('hello')).toBe('hello');
      expect(dashify('Hello')).toBe('hello');
      expect(dashify('helloWorldTest')).toBe('hello-world-test');
      expect(dashify('ABC')).toBe('a-b-c');
      expect(dashify('XMLHttpRequest')).toBe('x-m-l-http-request');
    });
  });

  describe('Path Handling', () => {
    it('should create clean paths', () => {
      expect(makePath('Hello World')).toBe('hello-world');
      expect(makePath('hello/world/')).toBe('hello/world');
      expect(makePath('hello//world')).toBe('hello/world');
    });

    it('should handle edge cases for path creation', () => {
      expect(makePath('')).toBe('');
      expect(makePath('hello')).toBe('hello');
      expect(makePath('Hello_World_Test')).toBe('hello-world-test');
      expect(makePath('hello///world/test/')).toBe('hello/world/test');
    });

    it('should clean paths', () => {
      expect(cleanPath('/hello//world/')).toBe('/hello/world');
      expect(cleanPath('hello///world')).toBe('hello/world');
    });

    it('should handle edge cases for path cleaning', () => {
      expect(cleanPath('')).toBe('');
      expect(cleanPath('/')).toBe('/');
      expect(cleanPath('//')).toBe('/');
      expect(cleanPath('hello/world')).toBe('hello/world');
      expect(cleanPath('/hello/world/')).toBe('/hello/world');
      expect(cleanPath('////hello////world////')).toBe('/hello/world');
    });
  });

  describe('Base64 Handling', () => {
    it('should handle base64 encoding', () => {
      expect(base64('test')).toBe('data:image/png;base64,test');
      expect(base64('test', 'image/jpeg')).toBe('data:image/jpeg;base64,test');
    });

    it('should handle edge cases for base64 encoding', () => {
      expect(base64('')).toBe('data:image/png;base64,');
      expect(base64('data:image/gif;base64,xyz')).toBe('data:image/gif;base64,xyz');
    });

    it('should handle base64 decoding', () => {
      expect(base64Decode('data:image/png;base64,test')).toBe('test');
      expect(base64Decode('data:image/jpeg;base64,test')).toBe('test');
    });

    it('should handle edge cases for base64 decoding', () => {
      expect(base64Decode('test')).toBe('test');
      expect(base64Decode('')).toBe('');
      expect(base64Decode('data:text/plain;base64,hello')).toBe('hello');
    });
  });

  describe('Legacy Functions', () => {
    it('should support legacy camelize function', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });
  });
});
