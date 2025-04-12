import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    buttons?: Array<{
        text: string;
        onPress?: () => void; 
        style?: 'default' | 'cancel' | 'destructive';
    }>;
    onClose?: () => void;
}



const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    buttons = [{ text: 'OK', onPress: () => { }, style: 'default' }],
    onClose,
}) => {
    if (!visible) return null;

    const handleButtonPress = (onPress?: () => void) => {
        onPress?.(); 
        onClose?.();
    };


    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    button.style === 'cancel' && styles.cancelButton,
                                    button.style === 'destructive' && styles.destructiveButton,
                                    index > 0 && { marginLeft: 10 }
                                ]}
                                onPress={() => handleButtonPress(button.onPress)}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        button.style === 'destructive' && styles.destructiveText
                                    ]}
                                >
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};



const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
        minWidth: Platform.OS === 'web' ? 320 : '70%',
        maxWidth: Platform.OS === 'web' ? 420 : '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#333',
    },
    modalText: {
        marginBottom: 24,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 22,
        paddingHorizontal: 8,
        color: '#444',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 8,
        marginTop: 8,
        gap: 12,
    },
    button: {
        backgroundColor: '#5c6bc0',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 2,
        minWidth: 100,
        alignItems: 'center',
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    destructiveButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ffcdd2',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 15,
    },
    cancelText: {
        color: '#757575',
    },
    destructiveText: {
        color: '#f44336',
    },
});

export default CustomAlert;
