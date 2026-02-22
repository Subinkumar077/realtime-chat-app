/**
 * Error handling utilities for the chat application
 * Provides error classification and user-friendly message mapping
 */

export type ErrorType = 'network' | 'service' | 'validation' | 'auth';

export interface ErrorMessageConfig {
  title: string;
  message: string;
  action: string;
  icon: string;
}

/**
 * Maps error types to user-friendly messages and actions
 */
export const ERROR_MESSAGES: Record<ErrorType, ErrorMessageConfig> = {
  network: {
    title: 'Connection Lost',
    message: 'Check your internet connection and try again.',
    action: 'Retry',
    icon: 'wifi-off',
  },
  service: {
    title: 'Something Went Wrong',
    message: 'We encountered an error. Please try again.',
    action: 'Retry',
    icon: 'alert-circle',
  },
  validation: {
    title: 'Invalid Input',
    message: 'Please check your message and try again.',
    action: 'Edit',
    icon: 'alert-triangle',
  },
  auth: {
    title: 'Session Expired',
    message: 'Please sign in again to continue.',
    action: 'Sign In',
    icon: 'lock',
  },
};

/**
 * Classifies an error into one of the defined error types
 * @param error - The error object to classify
 * @returns The classified error type
 */
export function classifyError(error: any): ErrorType {
  // Check for network errors
  if (
    error.message?.includes('network') ||
    error.message?.includes('offline') ||
    error.message?.includes('fetch') ||
    error.code === 'NETWORK_ERROR' ||
    error.name === 'NetworkError'
  ) {
    return 'network';
  }

  // Check for validation errors
  if (
    error.code === 'VALIDATION_ERROR' ||
    error.message?.includes('VALIDATION_ERROR') ||
    error.message?.includes('invalid') ||
    error.message?.includes('required')
  ) {
    return 'validation';
  }

  // Check for auth errors
  if (
    error.code === 'UNAUTHORIZED' ||
    error.code === 'UNAUTHENTICATED' ||
    error.message?.includes('UNAUTHORIZED') ||
    error.message?.includes('auth') ||
    error.message?.includes('session')
  ) {
    return 'auth';
  }

  // Default to service error
  return 'service';
}

/**
 * Gets a user-friendly error message for a given error type
 * @param errorType - The type of error
 * @param customMessage - Optional custom message to override default
 * @returns User-friendly error message
 */
export function getErrorMessage(
  errorType: ErrorType,
  customMessage?: string
): string {
  if (customMessage) {
    return customMessage;
  }
  return ERROR_MESSAGES[errorType].message;
}

/**
 * Gets the complete error configuration for a given error type
 * @param errorType - The type of error
 * @returns Complete error message configuration
 */
export function getErrorConfig(errorType: ErrorType): ErrorMessageConfig {
  return ERROR_MESSAGES[errorType];
}
