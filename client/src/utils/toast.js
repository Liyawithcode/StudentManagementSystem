let toastCallback = null;

export const registerToastCallback = (cb) => {
  toastCallback = cb;
};

export const toast = {
  success: (msg) => {
    if (toastCallback) toastCallback(msg, 'success');
  },
  error: (msg) => {
    if (toastCallback) toastCallback(msg || 'An error occurred', 'error');
  },
  info: (msg) => {
    if (toastCallback) toastCallback(msg, 'info');
  },
  warning: (msg) => {
    if (toastCallback) toastCallback(msg, 'warning');
  },
};
