import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
    [color, setColor] = useState('#fff');
    return (
        <>
            <View style={styles(color).container}>
                <StatusBar style="auto" />
                <Button title="Color Me!" onPress={() => setColor(getRandomColorHexCode())}/>
            </View>
            <View className="flex-1 items-center justify-center">
            <Text className="text-slate-800">Styling just works! 🎉</Text>
            </View>
        </>
    );
}

function getRandomColorHexCode() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const styles = (color) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
  