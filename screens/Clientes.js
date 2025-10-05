import React from 'react'
import { View, Text, StyleSheet } from 'react-native';

export default function Clientes() {
    return (
    <View style={styles.container}>
        <Text>Clientes de la Aplicación</Text>
    </View>
    )
}
const styles = StyleSheet.create(
    { container: 
        { flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' } 
    }
);