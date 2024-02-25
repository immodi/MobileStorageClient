import axios from 'axios';
import Stack from './helpers/Stack';
import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler } from 'react-native';

export default function App() {
    const [fileSystemData, setFileSystemData] = useState(getDirectoryContent(1));
    const [directorysHistoryStack, setDirectorysHistoryStack] = useState(new Stack(1));

    useEffect(()=> {
        BackHandler.addEventListener("hardwareBackPress", () => {
            setDirectorysHistoryStack(directorysHistoryStack.pop())
            return true
        })
    }, [])
    
    useEffect(() => {
        // WTF?
        setFileSystemData(getDirectoryContent(directorysHistoryStack.peek()))        
    }, [directorysHistoryStack]);

    return (
        <>
            <FileSystem 
                fileSystemData={fileSystemData}
                directorysHistoryStack={directorysHistoryStack}
                setDirectorysHistoryStack={setDirectorysHistoryStack}
            />
        </>
    );
}


function FileSystem({ fileSystemData, directorysHistoryStack, setDirectorysHistoryStack }) {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemPress = (item) => {        
        setSelectedItem(item);
        if (item.type === 'folder') {
            setDirectorysHistoryStack(directorysHistoryStack.push(item.dbId))
        }
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
        </View>
    );
};

function getDirectoryContent(currentDirectoryId) {
    let fileSystem = []
    const params = {
        dirId: currentDirectoryId
    };

    const response = axios.get(`http://192.168.1.10:8000`, { params }).then(response => {
        let filesArray = response.data.pop()
        let directorysArray = response.data;
        let dataId = 0

        directorysArray.forEach(directoryObject => {
            dataId += 1
            fileSystem.push({
                id: dataId,
                name: directoryObject.dirPath,
                type: 'folder',
                dbId: directoryObject.dirId
            })
        });

        filesArray.forEach(fileObject => {
            dataId += 1
            fileSystem.push({
                id: dataId,
                name: fileObject.fileName,
                type: 'file',
                dbId: fileObject.fileId
            })
        });
    }).catch(error => {
        console.log(error);
    });

    return fileSystem
}