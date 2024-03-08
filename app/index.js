import FileSystem from '../components/FileSystem'
// import downloadFile from '../helpers/downloadFile';

export default function App() {
    return (
        <FileSystem />
    );
}

// function testClient(permissions) {

//     // let client = new StorageClient()
//     // let res = await client.getFileSizeInBytes("img.jpg")
//     let testArray = [
//         [
//             'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/b/bd/Victor_Dragon_Form.jpg',
//             'victor', 
//             'image/jpeg'
//         ],
//         [
//             'https://static.wikia.nocookie.net/my-three-beautiful-wives-are-vampires/images/2/2f/Violet_Snow_official.jpg',
//             'violet.jpg',
//             'image/jpeg'
//         ]
//     ]
//     testArray.forEach(element => {
//         downloadFile(permissions, element[0], element[1], element[2])
//         console.log(`download ${element[1]}`);
//     });
// }
