import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface SuspensionModalProps {
    isVisible: boolean;
    suspendedUntil: string | null;
    onClose: () => void;
}

const SuspensionModal = ({ isVisible, suspendedUntil, onClose }: SuspensionModalProps) => {
    const handleClose = () => {
        onClose();
        router.replace('/login');
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Account Suspended</Text>

                    <Text style={styles.modalText}>
                        For your security, your account has been temporarily suspended due to unusual login activity.
                    </Text>

                    <Text style={styles.suspensionTime}>
                        Suspended until: {suspendedUntil || 'Unknown'}
                    </Text>

                    <Text style={styles.infoText}>
                        A verification link has been sent to your email. Please check your inbox to verify your identity and restore access to your account.
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleClose}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
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
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#e74c3c',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    suspensionTime: {
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
    },
    infoText: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 14,
        fontStyle: 'italic',
    },
    button: {
        backgroundColor: '#2980b9',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        width: 120,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SuspensionModal;