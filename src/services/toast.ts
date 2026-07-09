import Toast from "react-native-toast-message";

export function showToast(options: any) {
  Toast.show({ visibilityTime: 3500, autoHide: true, ...options });
  // Safeguard: force-dismiss after a short delay in case the library's
  // internal auto-hide timer does not fire on this device.
  setTimeout(() => {
    try {
      Toast.hide();
    } catch {
      // already hidden — ignore
    }
  }, 4000);
}
