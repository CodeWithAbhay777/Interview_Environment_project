const NAVIGATION_TOAST_KEY = 'navigation_toast';

export const navigateWithToast = (navigate, to, toastPayload, options = {}) => {
  try {
    if (toastPayload?.message) {
      sessionStorage.setItem(
        NAVIGATION_TOAST_KEY,
        JSON.stringify({
          type: toastPayload.type || 'info',
          message: toastPayload.message,
          id: toastPayload.id,
        })
      );
    }
  } catch {
    // no-op: if storage is unavailable, redirect still proceeds
  }

  navigate(to, { replace: true, ...options });
};

export const consumeNavigationToast = () => {
  try {
    const rawToast = sessionStorage.getItem(NAVIGATION_TOAST_KEY);
    if (!rawToast) {
      return null;
    }

    sessionStorage.removeItem(NAVIGATION_TOAST_KEY);
    return JSON.parse(rawToast);
  } catch {
    sessionStorage.removeItem(NAVIGATION_TOAST_KEY);
    return null;
  }
};
