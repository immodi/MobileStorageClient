import FileSystem from '../components/FileSystem'
import StorageClient from '../helpers/StorageAPIClient';

export default function App() {
    return (
        <FileSystem />
    );
}

function testClient() {

    let client = new StorageClient()
    client.getFileDataWithId(4).then((data) => {
        console.log(data);
    })
}
