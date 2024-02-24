import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function App() {
    
    return (
        <>
            {/* infinte loop :/ */}
            {/* <FileSystemComponent /> */}
            <StatusBar style="auto" />
        </>
    );
}

// const fileSystemData = [
//     { id: '1', name: 'Home', type: 'folder' },
//     { id: '2', name: 'Documents', type: 'folder' },
//     { id: '3', name: 'Downloads', type: 'folder' },
//     { id: '4', name: 'File.txt', type: 'file' },
// ];

// File System Component
const FileSystemComponent = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [fileSystemData, setFileSystemData] = useState(null);
    
    setFileSystemData(getDirectoryContent(setFileSystemData));
    
    const handleItemPress = (item) => {        
        setSelectedItem(item);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View className='p-2 border-b border-gray-300'>
                <Text className='text-base'>
                    {item.type === 'folder' ? '📁 ' : '📄 '}
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View className='flex-1 mt-5'>
            <Text className='text-xl font-bold p-4'>File System</Text>
            <FlatList
                data={fileSystemData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
            {selectedItem && (
                <View className='p-4'>
                <Text className='text-base font-bold'>
                    Selected: {selectedItem.name}
                </Text>
                </View>
            )}
        </View>
    );
};


async function getDirectoryContent() {
    const response = await axios.get(`http://192.168.1.10:8000`, null, { params: {
    }})
    .then(response => {
        let filesArray = response.data.pop()
        let directorysArray = response.data;
        let dataId = 0
        let fileSystem = []

        directorysArray.forEach(directoryObject => {
            dataId += 1
            fileSystem.push({
                id: dataId,
                name: directoryObject.dirPath,
                type: 'folder'
            })
        });

        filesArray.forEach(fileObject => {
            dataId += 1
            fileSystem.push({
                id: dataId,
                name: fileObject.fileName,
                type: 'file'
            })
        });

        return fileSystem
    })
    .catch(err => setFileSystemData([]));
}