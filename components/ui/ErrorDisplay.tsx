"use client";

import { AlertCircle, WifiOff, AlertTriangle, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorType, getErrorConfig } from "@/lib/errorHandling";

interface ErrorDisplayProps {
  type: ErrorType;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'banner' | 'modal';
}

const iconMap = {
  'wifi-off': WifiOff,
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  'lock': Lock,
};

export function ErrorDisplay({
  type,
  message: customMessage,
  onRetry,
  onDismiss,
  variant = 'inline',
}: ErrorDisplayProps) {
  const config = getErrorConfig(type);
  const Icon = iconMap[config.icon as keyof typeof iconMap] || AlertCircle;
  const displayMessage = customMessage || config.message;

  // Inline variant - compact error display for individual components
  if (variant === 'inline') {
    return (
      <div
        className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
        role="alert"
        aria-live="assertive"
      >
        <Icon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-900">{config.title}</p>
          <p className="text-sm text-red-700 mt-1">{displayMessage}</p>
          {(onRetry || onDismiss) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
                >
                  {config.action}
                </Button>
              )}
              {onDismiss && (
                <Button
                  onClick={onDismiss}
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-red-600 hover:text-red-800 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              )}
            </div>
          )}
        </div>
        {onDismiss && !onRetry && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  // Banner variant - full-width error banner for page-level errors
  if (variant === 'banner') {
    return (
      <div
        className="w-full bg-red-600 text-white"
        role="alert"
        aria-live="assertive"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{config.title}</p>
                <p className="text-sm opacity-90 mt-0.5">{displayMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs bg-white text-red-600 hover:bg-red-50"
                >
                  {config.action}
                </Button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-white hover:text-red-100 transition-colors"
                  aria-label="Dismiss error"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal variant - centered error modal for critical errors
  if (variant === 'modal') {
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="error-title"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Icon className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 id="error-title" className="text-lg font-semibold text-slate-900">
                {config.title}
              </h3>
              <p className="text-sm text-slate-600 mt-2">{displayMessage}</p>
              <div className="flex gap-3 mt-6">
                {onRetry && (
                  <Button
                    onClick={onRetry}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {config.action}
                  </Button>
                )}
                {onDismiss && (
                  <Button
                    onClick={onDismiss}
                    variant="outline"
                    className="flex-1"
                  >
                    {onRetry ? 'Cancel' : 'Dismiss'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
