/**
 * Logging Middleware - Validation Module
 * 
 * Validates all log parameters before sending to the API.
 * Ensures only valid stack, level, and package values are used.
 * Also validates that messages are non-empty strings.
 */

import {
  LogStack,
  LogLevel,
  LogPackage,
  VALID_STACKS,
  VALID_LEVELS,
  VALID_BACKEND_PACKAGES,
  VALID_FRONTEND_PACKAGES,
  VALID_COMMON_PACKAGES,
  VALID_PACKAGES
} from './types';

/** Result of a validation check */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates that a stack value is one of the allowed values.
 * @param stack - The stack value to validate
 * @returns ValidationResult indicating success or failure with error message
 */
export function validateStack(stack: string): ValidationResult {
  if (!stack || typeof stack !== 'string') {
    return { isValid: false, error: 'Stack is required and must be a string' };
  }

  if (!VALID_STACKS.includes(stack as LogStack)) {
    return {
      isValid: false,
      error: `Invalid stack "${stack}". Valid values: ${VALID_STACKS.join(', ')}`
    };
  }

  return { isValid: true };
}

/**
 * Validates that a log level is one of the allowed severity levels.
 * @param level - The log level to validate
 * @returns ValidationResult indicating success or failure with error message
 */
export function validateLevel(level: string): ValidationResult {
  if (!level || typeof level !== 'string') {
    return { isValid: false, error: 'Level is required and must be a string' };
  }

  if (!VALID_LEVELS.includes(level as LogLevel)) {
    return {
      isValid: false,
      error: `Invalid level "${level}". Valid values: ${VALID_LEVELS.join(', ')}`
    };
  }

  return { isValid: true };
}

/**
 * Validates that a package value is allowed for the given stack.
 * Backend-specific packages are only valid with the "backend" stack.
 * Frontend-specific packages are only valid with the "frontend" stack.
 * Common packages are valid with any stack.
 * 
 * @param pkg - The package value to validate
 * @param stack - The stack context for contextual validation
 * @returns ValidationResult indicating success or failure with error message
 */
export function validatePackage(pkg: string, stack: string): ValidationResult {
  if (!pkg || typeof pkg !== 'string') {
    return { isValid: false, error: 'Package is required and must be a string' };
  }

  // Check if the package is in the combined valid list
  if (!VALID_PACKAGES.includes(pkg as LogPackage)) {
    return {
      isValid: false,
      error: `Invalid package "${pkg}". Valid values: ${VALID_PACKAGES.join(', ')}`
    };
  }

  // Contextual validation: ensure package matches the stack
  const isCommon = VALID_COMMON_PACKAGES.includes(pkg as any);
  const isBackend = VALID_BACKEND_PACKAGES.includes(pkg as any);
  const isFrontend = VALID_FRONTEND_PACKAGES.includes(pkg as any);

  if (stack === 'backend' && isFrontend && !isCommon) {
    return {
      isValid: false,
      error: `Package "${pkg}" is a frontend-only package and cannot be used with stack "backend"`
    };
  }

  if (stack === 'frontend' && isBackend && !isCommon) {
    return {
      isValid: false,
      error: `Package "${pkg}" is a backend-only package and cannot be used with stack "frontend"`
    };
  }

  return { isValid: true };
}

/**
 * Validates that a log message is a non-empty string.
 * @param message - The message to validate
 * @returns ValidationResult indicating success or failure with error message
 */
export function validateMessage(message: string): ValidationResult {
  if (!message || typeof message !== 'string') {
    return { isValid: false, error: 'Message is required and must be a non-empty string' };
  }

  if (message.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be an empty or whitespace-only string' };
  }

  return { isValid: true };
}

/**
 * Validates all log parameters at once.
 * Returns the first validation error encountered, if any.
 * 
 * @param stack - The stack value
 * @param level - The log level
 * @param pkg - The package identifier
 * @param message - The log message
 * @returns ValidationResult with the first error found, or success
 */
export function validateLogParams(
  stack: string,
  level: string,
  pkg: string,
  message: string
): ValidationResult {
  const stackResult = validateStack(stack);
  if (!stackResult.isValid) return stackResult;

  const levelResult = validateLevel(level);
  if (!levelResult.isValid) return levelResult;

  const packageResult = validatePackage(pkg, stack);
  if (!packageResult.isValid) return packageResult;

  const messageResult = validateMessage(message);
  if (!messageResult.isValid) return messageResult;

  return { isValid: true };
}
