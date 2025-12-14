/**
 * Toast notification service for consistent error/success messaging
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const DEFAULT_DURATION = 5000;
const DEFAULT_POSITION = 'top-right';

/**
 * Creates and displays a toast notification
 */
export function showToast(
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
): void {
  const duration = options.duration || DEFAULT_DURATION;
  const position = options.position || DEFAULT_POSITION;

  // Remove existing toasts of the same type if needed
  const existingToasts = document.querySelectorAll(
    `[data-toast-type="${type}"]`
  );
  if (existingToasts.length > 2) {
    existingToasts[0].remove();
  }

  const toast = document.createElement('div');
  toast.setAttribute('data-toast-type', type);
  toast.className = `fixed ${getPositionClasses(position)} z-50 max-w-md animate-in slide-in-from-top-5`;

  const bgColor = getBackgroundColor(type);
  const icon = getIcon(type);

  toast.innerHTML = `
    <div class="${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3">
      <div class="flex-shrink-0 mt-0.5">${icon}</div>
      <div class="flex-1">
        <div class="font-medium text-sm">${escapeHtml(message)}</div>
      </div>
      <button 
        onclick="this.closest('[data-toast-type]').remove()" 
        class="flex-shrink-0 text-white/80 hover:text-white transition-colors"
        aria-label="Close"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('animate-out', 'slide-out-to-top-5');
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

/**
 * Shows a success toast
 */
export function showSuccess(message: string, options?: ToastOptions): void {
  showToast(message, 'success', options);
}

/**
 * Shows an error toast
 */
export function showError(message: string, options?: ToastOptions): void {
  showToast(message, 'error', {
    ...options,
    duration: options?.duration || 7000,
  });
}

/**
 * Shows a warning toast
 */
export function showWarning(message: string, options?: ToastOptions): void {
  showToast(message, 'warning', options);
}

/**
 * Shows an info toast
 */
export function showInfo(message: string, options?: ToastOptions): void {
  showToast(message, 'info', options);
}

/**
 * Shows a detailed error toast with expandable details
 */
export function showDetailedError(
  title: string,
  details: string[],
  options?: ToastOptions
): void {
  const duration = options?.duration || 10000;
  const position = options?.position || DEFAULT_POSITION;

  const toast = document.createElement('div');
  toast.setAttribute('data-toast-type', 'error');
  toast.className = `fixed ${getPositionClasses(position)} z-50 max-w-md animate-in slide-in-from-top-5`;

  const detailsId = `error-details-${Date.now()}`;
  const isExpanded = details.length <= 3;

  toast.innerHTML = `
    <div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-0.5">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm mb-1">${escapeHtml(title)}</div>
          <div id="${detailsId}" class="text-xs space-y-1 ${isExpanded ? '' : 'hidden'}">
            ${details
              .slice(0, 5)
              .map((detail) => `<div>• ${escapeHtml(detail)}</div>`)
              .join('')}
            ${details.length > 5 ? `<div class="text-white/80">...and ${details.length - 5} more error(s)</div>` : ''}
          </div>
          ${
            details.length > 3
              ? `
            <button 
              onclick="const el = document.getElementById('${detailsId}'); el.classList.toggle('hidden'); this.textContent = el.classList.contains('hidden') ? 'Show details' : 'Hide details';"
              class="text-xs underline mt-1 hover:text-white/80 transition-colors"
            >
              ${isExpanded ? 'Hide' : 'Show'} details
            </button>
          `
              : ''
          }
        </div>
        <button 
          onclick="this.closest('[data-toast-type]').remove()" 
          class="flex-shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('animate-out', 'slide-out-to-top-5');
      setTimeout(() => toast.remove(), 300);
    }
  }, duration);
}

// Helper functions
function getPositionClasses(position: string): string {
  const positions: Record<string, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };
  return positions[position] || positions[DEFAULT_POSITION];
}

function getBackgroundColor(type: ToastType): string {
  const colors: Record<ToastType, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };
  return colors[type];
}

function getIcon(type: ToastType): string {
  const icons: Record<ToastType, string> = {
    success: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    `,
    error: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    `,
    warning: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    `,
    info: `
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      </svg>
    `,
  };
  return icons[type];
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
