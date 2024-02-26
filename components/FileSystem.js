import Stack from '../helpers/Stack'
import getFileSystem from '../helpers/GetData';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler } from 'react-native';

export default function FileSystem() {
    const [fileSystemData, setFileSystemData] = useState(null);
    const [directorysHistoryStack, setDirectorysHistoryStack] = useState(new Stack(1));
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(()=> {
        getFileSystem(1, setFileSystemData);
        BackHandler.addEventListener("hardwareBackPress", () => {
            let newStack = directorysHistoryStack.pop()
            if (newStack) {
                refreshFileSystem(newStack, setFileSystemData, setDirectorysHistoryStack);
                console.log("removed item");
            }
            return true
        })
    }, [])


    const handleItemPress = (item) => {        
        setSelectedItem(item);
        if (item.type === 'folder' && directorysHistoryStack.peek() !== item.dbId) {
            refreshFileSystem(directorysHistoryStack.push(item.dbId), setFileSystemData, setDirectorysHistoryStack);
            console.log("added new item");
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View className='p-2 border-b flex-row flex border-gray-300'>
                <Text className='text-base'>
                    {item.type === 'folder' ? '📁 ' : '📄 '}
                    {item.name}
                </Text>
                {item.type === 'file' && <Text className='text-sm ml-auto'>{(item.size / 1024 / 1024).toFixed(3)} MB</Text>}
            </View>
        </TouchableOpacity>
    );
    

    return (
        <View className='flex-1 mt-5'>
            <Text className='text-xl font-bold p-4'>File System</Text>
            {
                fileSystemData
                ?
                    (fileSystemData.length === 0)
                    ?
                    <View className='flex flex-grow items-center justify-center'>
                        <Text className='text-2xl font-bold'>Empty Directory</Text>
                    </View>
                    :
                    <FlatList
                        data={fileSystemData}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                    />
                :
                <View className='flex flex-grow items-center justify-center'>
                    <Text className='text-2xl font-bold'>An Error Occured :/</Text>
                </View>
            }
        </View>
    );
};

function refreshFileSystem(newStack, setFileSystemData, setDirectorysHistoryStack) {
    getFileSystem(newStack.peek(), setFileSystemData)
    setDirectorysHistoryStack(newStack)
}