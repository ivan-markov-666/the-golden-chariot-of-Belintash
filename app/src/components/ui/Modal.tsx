import React, { useEffect } from 'react';
import {
  View,
  Modal as RNModal,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Modal Component
 * 
 * Modal with overlay, animations, and accessibility support.
 * Supports different sizes and positions.
 */

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';
export type ModalPosition = 'center' | 'bottom';

interface ModalProps {
  /** Whether modal is visible */
  visible: boolean;
  /** Close handler - called when clicking overlay or back button */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Modal size */
  size?: ModalSize;
  /** Modal position */
  position?: ModalPosition;
  /** Whether to close on overlay press */
  closeOnOverlayPress?: boolean;
  /** Whether to show close button */
  showCloseButton?: boolean;
  /** Whether to avoid keyboard */
  avoidKeyboard?: boolean;
  /** Whether to use animation */
  animated?: boolean;
  /** Test ID */
  testID?: string;
  /** Additional container style */
  style?: ViewStyle;
  /** Additional overlay style */
  overlayStyle?: ViewStyle;
  /** Additional content container style */
  contentStyle?: ViewStyle;
}

const { height: screenHeight } = Dimensions.get('window');

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  size = 'md',
  position = 'center',
  closeOnOverlayPress = true,
  showCloseButton = false,
  avoidKeyboard = true,
  animated = true,
  testID,
  style,
  overlayStyle,
  contentStyle,
}) => {
  const { theme } = useTheme();

  const getModalWidth = (): `${number}%` | number => {
    switch (size) {
      case 'sm':
        return '80%';
      case 'md':
        return '90%';
      case 'lg':
        return '95%';
      case 'full':
        return '100%';
      default:
        return '90%';
    }
  };

  const getModalMaxHeight = (): number => {
    switch (size) {
      case 'sm':
        return screenHeight * 0.5;
      case 'md':
        return screenHeight * 0.7;
      case 'lg':
        return screenHeight * 0.85;
      case 'full':
        return screenHeight;
      default:
        return screenHeight * 0.7;
    }
  };

  const getPositionStyles = (): ViewStyle => {
    switch (position) {
      case 'center':
        return {
          justifyContent: 'center',
          alignItems: 'center',
        };
      case 'bottom':
        return {
          justifyContent: 'flex-end',
          alignItems: 'center',
        };
      default:
        return {
          justifyContent: 'center',
          alignItems: 'center',
        };
    }
  };

  const handleOverlayPress = () => {
    if (closeOnOverlayPress) {
      onClose();
    }
  };

  const Content = (
    <View
      style={[
        styles.container,
        getPositionStyles(),
        style,
      ]}
      testID={testID}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: theme.colors.overlay,
            },
            overlayStyle,
          ]}
        />
      </TouchableWithoutFeedback>

      <View
        style={[
          styles.content,
          {
            width: getModalWidth(),
            maxHeight: getModalMaxHeight(),
            backgroundColor: theme.colors.surface,
            borderRadius: position === 'bottom' 
              ? `${theme.borderRadius.xl}px 0 0 0` 
              : theme.borderRadius.lg,
            ...theme.shadows.lg,
          },
          position === 'bottom' && styles.bottomContent,
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animated ? 'fade' : 'none'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {avoidKeyboard && Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.keyboardAvoidingView}
        >
          {Content}
        </KeyboardAvoidingView>
      ) : (
        Content
      )}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    overflow: 'hidden',
  },
  bottomContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

export default Modal;
