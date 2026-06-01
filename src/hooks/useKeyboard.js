/**
 * useKeyboard — track keyboard visibility and height
 */
import {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';

const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = e => {
      setKeyboardHeight(e.endCoordinates.height);
      setIsKeyboardVisible(true);
    };
    const onHide = () => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {keyboardHeight, isKeyboardVisible};
};

export default useKeyboard;
