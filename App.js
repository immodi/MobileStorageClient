import FileSystem from './components/FileSystem'
import StorageClient from './helpers/StorageAPIClient';

export default function App() {
    // testClient()
    return (
        <FileSystem />
    );
}

async function testClient() {
    let client = new StorageClient()
    // let res = await client.getFileSizeInBytes("img.jpg")
    console.log(res);
}