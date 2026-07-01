import Clipboard from '@react-native-clipboard/clipboard';
import { ToastService } from '../../components/common';

export const copyToClipboard = (text) => {
  if (typeof text !== 'string') return;
  if (Clipboard?.setString) {
    Clipboard.setString(text);
  }
};

export const getClipboardText = async () => {
  if (Clipboard?.getString) {
    return await Clipboard.getString();
  }
  return '';
};

export const hasClipboardString = async () => {
  if (Clipboard?.hasString) {
    return await Clipboard.hasString();
  }
  return false;
};

export const copyWithToast = (text, message = 'Copied successfully') => {
  if (!text) return;
  copyToClipboard(text);
  ToastService.show({ type: 'success', message });
};
