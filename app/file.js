import { useLocalSearchParams } from "expo-router";
import { Text, View, Button, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import useBaseDirectory from "../helpers/hooks/useBaseDirectory";
import downloadFile from "../helpers/downloadFile";
import StorageClient from "../helpers/StorageAPIClient";


const FileCard = () => {
    const client = new StorageClient();
    const itemData = useLocalSearchParams();
    const permissions = useBaseDirectory();
    const [buttonText, setButtonText] = useState('Download');
    const [filesUris, setFilesUris] = useState([]);
    const [progress, setProgress] = useState({
        progress: 0,
        currentIteration: 0,
        data: null,
        download: false
    });

    useEffect(()=> {
        BackHandler.addEventListener("hardwareBackPress", () => {
            router.back()
            return true
        })

        client.permissions = permissions
        client.setProgress = setProgress
    }, [])

    useEffect(() => {
        if (progress.data && progress.progress > 0 && progress.currentIteration < progress.data.length && progress.download) {
            downloadFile(permissions, progress, setProgress).then(async (outFileUri) => {
                setFilesUris((filesUris) => [...filesUris, outFileUri])
            })
        }
        if (progress.progress < 1 && progress.data) {
            setButtonText("Cancel")
        }

        if (progress.progress >= 1 && progress.data && filesUris.length !== progress.data.length) {
            setButtonText("Combining Files...")
        }

    }, [progress])

    useEffect(() => {
        if (progress.data && filesUris.length === progress.data.length) {
            console.log("merging");
            let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
            client.mergeAndWriteBinFiles(permissions, filesUris.sort(collator.compare), 'Cheat Code Hitter.zip', 'application/zip')
            .then(() => {
                setButtonText("Done")
            })
        }
    }, [filesUris])

    const onDownload = () => {
        // let downloadData = [
        //     {   
        //         chunkUrl: 'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/b/bd/Victor_Dragon_Form.jpg',
        //         chunkName: 'victor.jpg',
        //         chunkMimeType: 'image/jpeg'
        //     },
        //     {
        //         chunkUrl: 'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/2/2f/Violet_Snow_official.jpg',
        //         chunkName: 'viloet.jpg',
        //         chunkMimeType: 'image/jpeg'
        //     },
        // ]
        client.downloadFileFromServer(itemData.id, progress, setProgress)

        // let data = [
        //     "content://com.android.externalstorage.documents/tree/primary%3ADownload%2FCloudstream%2FStorage%20Client/document/primary%3ADownload%2FCloudstream%2FStorage%20Client%2FThe%20Cheat%20Code%20Hitter.zip_1.bin",
        //     "content://com.android.externalstorage.documents/tree/primary%3ADownload%2FCloudstream%2FStorage%20Client/document/primary%3ADownload%2FCloudstream%2FStorage%20Client%2FThe%20Cheat%20Code%20Hitter.zip_2.bin"
        // ] 

        // client.mergeAndWriteBinFiles(permissions, data, 'output', 'application/zip')
        // setProgress({
        //     ...progress,
        //     progress: 0.0001,
        //     data: downloadData,
        //     download: true
        // })
    }

    const cancelDownload = () => {
        setProgress(0)
    }

   

    return (
        <View className="flex flex-col justify-start w-full h-full border border-gray-200 rounded-lg p-4">
            <View className="flex justify-start h-5/6 mb-5">
                <Text className="mt-3 mb-3 text-lg font-medium">FileName: {itemData.name}</Text>
                <Text className="mt-3 mb-3 text-gray-500">FileSize: {itemData.size}</Text>
            </View>
            
            {/* <View className="h-1/6 relative flex flex-col justify-end">
            </View> */}

            <View className="h-1/6 relative bottom-7 flex flex-col justify-end">
                {
                    (progress.progress < 1 && progress.progress > 0) && <Progress.Bar progress={progress.progress} width={null} className="relative bottom-5"/>
                }
                <Button
                    title={buttonText}
                    onPress={progress.progress === 0 ? onDownload : cancelDownload}
                    disabled={(buttonText === 'Done')}
                />
            </View>
        </View>
    );
};

export default FileCard;
