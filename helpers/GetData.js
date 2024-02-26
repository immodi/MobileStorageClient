import axios from 'axios';

export default async function getFileSystem(currentDirectoryId, setFileSystemData) {
    const params = {
        dirId: currentDirectoryId
    };
    const response = await axios.get(`http://192.168.1.10:8000`, { params });
    
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