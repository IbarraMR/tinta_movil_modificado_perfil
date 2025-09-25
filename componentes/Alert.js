import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    } from 'react-native';

    const { width: SCREEN_W } = Dimensions.get('window');

    const IconBW = ({ type = 'info', size = 40 }) => {
    const containerStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
    };
    const textStyle = {
        fontSize: Math.round(size * 0.9),
        lineHeight: Math.round(size * 0.95),
        color: '#000',
        textAlign: 'center',
    };

    let char = 'i';
    switch (type) {
        case 'success':
        char = '✓';
        break;
        case 'error':
        char = '✕';
        break;
        case 'warn':
        char = '!';
        break;
        default:
        char = 'i';
    }

    return (
        <View style={containerStyle} accessible accessibilityRole="image" accessibilityLabel={`${type} icon`}>
        <Text style={textStyle}>{char}</Text>
        </View>
    );
    };

    const CustomAlertModal = ({
    visible = false,
    type = 'info',
    title = '',
    message = '',
    confirmText = 'OK',
    cancelText = 'Cancelar',
    showCancel = false,
    onConfirm = () => {},
    onCancel = () => {},
    }) => {
    const scale = useRef(new Animated.Value(0.9)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
        Animated.parallel([
            Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }),
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
        } else {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 0.95, duration: 140, useNativeDriver: true }),
        ]).start();
        }
    }, [visible, scale, opacity]);

    return (
        <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
        <View style={styles.modalBackdrop}>
            <Animated.View style={[styles.modalBox, { transform: [{ scale }], opacity }]}>
            <View style={styles.iconWrap}>
                <IconBW type={type} size={32} />
            </View>

            {!!title && <Text style={styles.modalTitle}>{title}</Text>}
            {!!message && <Text style={styles.modalMessage}>{message}</Text>}

            <View style={styles.buttonsRow}>
                {showCancel && (
                <Pressable style={[styles.btn, styles.btnOutline]} onPress={onCancel}>
                    <Text style={[styles.btnText, styles.btnTextOutline]}>{cancelText}</Text>
                </Pressable>
                )}
                <Pressable style={[styles.btn, styles.btnSolid]} onPress={onConfirm}>
                <Text style={[styles.btnText, styles.btnTextSolid]}>{confirmText}</Text>
                </Pressable>
            </View>
            </Animated.View>
        </View>
        </Modal>
    );
    };

    const ModalContext = createContext(null);

    export const ModalProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [opts, setOpts] = useState({});
    const resolverRef = useRef(null);

    const showModal = (options = {}) => {
        return new Promise((resolve) => {
        resolverRef.current = resolve;
        setOpts(options);
        setVisible(true);
        });
    };

    const handleConfirm = () => {
        setVisible(false);
        if (opts.onConfirm) opts.onConfirm();
        if (resolverRef.current) resolverRef.current(true);
        resolverRef.current = null;
    };

    const handleCancel = () => {
        setVisible(false);
        if (opts.onCancel) opts.onCancel();
        if (resolverRef.current) resolverRef.current(false);
        resolverRef.current = null;
    };

    return (
        <ModalContext.Provider value={{ showModal }}>
        {children}
        <CustomAlertModal
            visible={visible}
            type={opts.type || 'info'}
            title={opts.title || ''}
            message={opts.message || ''}
            confirmText={opts.confirmText || 'OK'}
            cancelText={opts.cancelText || 'Cancelar'}
            showCancel={!!opts.showCancel}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
        </ModalContext.Provider>
    );
    };

    export const useModal = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal must be used within a ModalProvider');
    return ctx;
    };

    const ToastContext = createContext(null);

    export const ToastProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(null);

    const translateY = useRef(new Animated.Value(40)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const hideTimerRef = useRef(null);

    useEffect(() => {
        if (!current && queue.length > 0) {
        const next = queue[0];
        setQueue((q) => q.slice(1));
        setCurrent(next);
        }
    }, [queue, current]);

    useEffect(() => {
        if (!current) return;

        opacity.setValue(0);
        translateY.setValue(20);

        Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
        ]).start();

        const duration = current.durationMs || 3000;
        hideTimerRef.current = setTimeout(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 20, duration: 200, useNativeDriver: true }),
        ]).start(() => setCurrent(null));
        }, duration);

        return () => {
        if (hideTimerRef.current) {
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
        };
    }, [current, opacity, translateY]);

    const show = ({ type = 'info', text = '', durationMs = 3000 } = {}) => {
        setQueue((q) => [...q, { type, text, durationMs }]);
    };

    return (
        <ToastContext.Provider value={{ show }}>
        {children}
        {current && (
            <Animated.View
            pointerEvents="none"
            style={[styles.toastWrap, { transform: [{ translateY }], opacity }]}
            >
            <View style={styles.toastInner}>
                <View style={styles.toastIcon}>
                <IconBW type={current.type} size={20} />
                </View>
                <Text style={styles.toastText}>{current.text}</Text>
            </View>
            </Animated.View>
        )}
        </ToastContext.Provider>
    );
    };

    export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
    };

    const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalBox: {
        width: Math.min(320, SCREEN_W - 40), // más angosto
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 6,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        color: '#222',
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center', // centrado
        alignItems: 'center',
        width: '100%',
    },
    btn: {
        minWidth: 92,
        paddingVertical: Platform.select({ ios: 10, android: 8 }),
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
    },
    btnSolid: {
        backgroundColor: '#000',
    },
    btnOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#000',
    },
    btnText: {
        fontSize: 14,
        fontWeight: '600',
    },
    btnTextSolid: {
        color: '#fff',
    },
    btnTextOutline: {
        color: '#000',
    },
    toastWrap: {
        position: 'absolute',
        bottom: 28,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    toastInner: {
        minHeight: 44,
        maxWidth: 760,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#000',
    },
    toastIcon: {
        width: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    toastText: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
});