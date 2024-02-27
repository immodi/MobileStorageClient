import axios from 'axios';
import StorageClient from './StorageAPIClient';

export default async function getFileSystem(currentDirectoryId, setFileSystemData) {
    let client = new StorageClient()
    const response = await client.getCurrentDirectoryContents(currentDirectoryId) 
    
    if (response.status === 200) {
        let fileSystem = []
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
                size: fileObject.fileSize,
                dbId: fileObject.fileId
            })
        });

        setFileSystemData(fileSystem)
    } else {
        setFileSystemData(null)
    }
}