import { useLocalSearchParams } from "expo-router";
import { Text, View, Button, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import useBaseDirectory from "../helpers/hooks/useBaseDirectory";
import downloadFile from "../helpers/downloadFile";

const FileCard = () => {
    const itemData = useLocalSearchParams();
    const permissions = useBaseDirectory();
    const [filesUris, setFilesUris] = useState([]);
    const [progress, setProgress] = useState({
        progress: 0,
        currentIteration: 0,
        data: null
    });


    useEffect(() => {
        if (progress.data && progress.progress > 0 && progress.currentIteration < progress.data.length) {
            downloadFile(permissions, progress, setProgress).then(async (outFileUri) => {
                setFilesUris([...filesUris, outFileUri])
            })
        }
        console.log(filesUris);
    }, [progress])

    const onDownload = () => {
        let downloadData = [
            [   
                'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/b/bd/Victor_Dragon_Form.jpg',
                'victor.jpg',
                'image/jpeg'
            ],
            [
                'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/2/2f/Violet_Snow_official.jpg',
                'viloet.jpg',
                'image/jpeg'
            ],
            [
                'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/9/90/Scathach.jpg',
                'scathach.jpg',
                'image/jpeg'
            ],
            [
                'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/7/7a/Roxanneofficial.jpg',
                'roxanne.jpg',
                'image/jpeg'
            ]
        ]
        
        setProgress({
            ...progress,
            progress: 0.0001,
            data: downloadData
        })
    }

    const cancelDownload = () => {
        setProgress(0)
    }

    useEffect(()=> {
        BackHandler.addEventListener("hardwareBackPress", () => {
            router.back()
            return true
        })
    }, [])


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
                    title={progress.progress === 0 ? "Download" : (progress.progress < 1) ? "Cancel" : "Done"}
                    onPress={progress.progress === 0 ? onDownload : cancelDownload}
                    disabled={(progress.progress >= 1)}
                />
            </View>
        </View>
    );
};

export default FileCard;
