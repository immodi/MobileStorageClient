import * as FileSystem from 'expo-file-system';

export default function downloadFile(permissions, downloadUrl, fileName, fileMimeType) {
    // const [progress, setProgress] = useState(0);
    // const [downloadUrl, setDownloadUrl] = useState(inputDownloadUrl);
    // const [fileName, setFileName] = useState(inputFileName);
            
    const downloadResumable = createDownloadResumable(downloadUrl, fileName)
    // const fileMimeType = 'image/jpeg'
    startDownloading(permissions, downloadResumable, fileName, fileMimeType)
}

const startDownloading = async (permissions, downloadResumable, fileName, fileMimeType) => {
    try {
        if (permissions) {
            console.log("got permissions");
            const { uri } = await downloadResumable.downloadAsync();
            console.log('Finished downloading to ', uri);
            saveAndroidFile(permissions, uri, fileName, fileMimeType);
            return
        }
    } catch (e) {
        console.error(e);
    }
}


const createDownloadResumable = (url, fileName) => {
    const downloadResumable = FileSystem.createDownloadResumable(
        url,
        FileSystem.cacheDirectory + fileName,
        {}
    );

    return downloadResumable
}

const saveAndroidFile = async (permissions, fileUri, fileName, fileMimeType) => {
    try {
        // const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(baseDirectoryUri);
        if (!permissions.granted) {
            console.log("permissions not granted");
            return;
        }
        
        try {
            console.log("got permissions saving");
            const fileString = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
            await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri+"%2F", fileName, fileMimeType)
            .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, fileString, { encoding: FileSystem.EncodingType.Base64 });
                // alert(`File ${fileName} saved in ${permissions.directoryUri}`);
            }).catch((e) => {
                console.log(e);
            });
        } catch (e) {
            throw new Error(e);
        }
    } catch (err) {
        console.log(err);
    }
}

const callback = (downloadProgress) => {
    const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100;
    console.log(`${progress}% downloaded`);
};

