import { useLocalSearchParams } from "expo-router";
import { Text, View, Button, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';

const FileCard = () => {
    const [progess, setProgress] = useState(0)
    const [interval, setInterval] = useState(null)
    const itemData = useLocalSearchParams();

    const onDownload = () => {
       let interval = doStuff(progess, setProgress)
       setInterval(interval)
    }

    const cancelDownload = () => {
        setProgress(0)
        clearInterval(interval)
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
                    (progess > 0 && progess < 1) && <Progress.Bar progress={progess} width={null} className=" relative bottom-5"/>
                }
                <Button
                    title={progess === 0 ? "Download" : (progess < 1) ? "Cancel" : "Done :)"}
                    onPress={progess === 0 ? onDownload : cancelDownload}
                    disabled={(progess >= 1)}
                />
            </View>
        </View>
    );
};

function doStuff(progess, setProgress) {
    let progressCopy = progess + 0.00001
    setProgress(progressCopy)
    
    const interval = setInterval(() => {
        progressCopy += 0.1
        setProgress(progressCopy)
        console.log(progressCopy);

        if (progressCopy >= 1) {
            clearInterval(interval)
        }

    }, 1000);
    
    return interval
}

export default FileCard;
