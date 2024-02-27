import Stack from '../helpers/Stack'
import getFileSystem from '../helpers/GetData';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler } from 'react-native';

export default function FileSystem() {
    const [fileSystemData, setFileSystemData] = useState(null);
    const [directorysHistoryStack, setDirectorysHistoryStack] = useState(new Stack(1));
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        getFileSystem(1, setFileSystemData);
        BackHandler.addEventListener("hardwareBackPress", () => {
            let newStack = directorysHistoryStack.pop()
            if (newStack) {
                refreshFileSystem(newStack, setFileSystemData, setDirectorysHistoryStack, setLoading);
                console.log("removed item");
            }
            return true
        })
    }, [])

    useEffect(() => {
        setLoading(false)
    }, [fileSystemData])


    const handleItemPress = (item) => {        
        setSelectedItem(item);
        if (item.type === 'folder' && directorysHistoryStack.peek() !== item.dbId) {
            refreshFileSystem(directorysHistoryStack.push(item.dbId), setFileSystemData, setDirectorysHistoryStack, setLoading);
            console.log("added new item");
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View className='p-2 border-b flex-row flex border-gray-300'>
                <Text className='text-base'>
                    {item.type === 'folder' ? '📁 ' : '📄 '}
                    {item.type === 'folder'? getBaseName(item.name) : item.name}
                </Text>
                {item.type === 'file' && <Text className='text-sm ml-auto'>{getItemSizeString(item.size)}</Text>}
            </View>
        </TouchableOpacity>
    );
    

    return (
        !loading
        ?
        <View className='flex-1 mt-4'>
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
        :
        <View className='flex-1 items-center justify-center'>
            <Text className='text-2xl font-bold'>Loading...</Text>
        </View>
    
    );
};

function refreshFileSystem(newStack, setFileSystemData, setDirectorysHistoryStack, setLoading) {
    setLoading(true)
    getFileSystem(newStack.peek(), setFileSystemData)
    setDirectorysHistoryStack(newStack)
}

const getBaseName = (path) => {
    return path.split("/")[path.split("/").length-1]
}

const getItemSizeString = (bytes) => {
    if (bytes < 1024 && bytes >= 0) {
        return `${bytes} B`;

    } else if (bytes < Math.pow(1024, 2) && bytes >= 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    
    } else if (bytes < Math.pow(1024, 3) && bytes >= Math.pow(1024, 2)) {
        return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    
    } else if (bytes < Math.pow(1024, 4) && bytes >= Math.pow(1024, 3)) {
        return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
    
    } else {
        return `NaN`;
    }
}