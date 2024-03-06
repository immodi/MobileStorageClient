import * as FileSystem from 'expo-file-system';

export default async function downloadFile(permissions, progress, setProgress) {    

    let downloadUrl =  progress.data[progress.currentIteration][0]
    let fileName = progress.data[progress.currentIteration][1]
    let fileMimeType = progress.data[progress.currentIteration][2]
    const downloadResumable = createDownloadResumable(downloadUrl, fileName)

    return await startDownloading(permissions, downloadResumable, fileName, fileMimeType, progress, setProgress)
}


const startDownloading = async (permissions, downloadResumable, fileName, fileMimeType, progress, setProgress) => {
    try {
        if (permissions) {
            const { uri } = await downloadResumable.downloadAsync();
            return await saveAndroidFile(permissions, uri, fileName, fileMimeType, progress, setProgress);
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

const saveAndroidFile = async (permissions, fileUri, fileName, fileMimeType, progress, setProgress) => {
    try {
        // const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(baseDirectoryUri);
        if (!permissions.granted) {
            console.log("permissions not granted");
            return;
        }
        
        try {
            console.log("got permissions saving");
            const fileString = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
            let outputFileUri = null
            await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri+"%2F", fileName, fileMimeType)
            .then(async (uri) => {
                await FileSystem.writeAsStringAsync(uri, fileString, { encoding: FileSystem.EncodingType.Base64 });
                // alert(`File ${fileName} saved in ${permissions.directoryUri}`);
                if (progress.currentIteration < progress.data.length) {
                    setProgress({
                        ...progress,
                        progress: progress.progress + 1/progress.data.length,
                        currentIteration: progress.currentIteration + 1,
                    })
                }
                outputFileUri = uri
            }).catch((e) => {
                console.log(e);
            });
            return new Promise((resolve, reject) => {
                resolve(outputFileUri)
            })
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

