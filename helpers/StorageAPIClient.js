import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';

class StorageClient {
    constructor(apiUrl = "http://192.168.1.10:8000") {
        this.apiUrl = apiUrl;
        this.mainDirectory = null
    }

    async addFile(file_name, file_size, file_mime_type, directory_path) {
        const data = {
            name: file_name,
            mimeType: file_mime_type,
            size: file_size,
            path: directory_path,
        };
        console.log(data);

        const response = await axios.post(`${this.apiUrl}/file`, data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    async getFileData(file_path) {
        const response = await axios.get(`${this.apiUrl}/file`, {
            params: { filePath: file_path },
        });
        return response.data;
    }

    async getCurrentDirectoryContents(directory_id = 1) {
        const response = await axios.get(this.apiUrl, { params: { dirId: directory_id } });
        return response;
    }

    async getDirectoryData(directory_path = null) {
        const params = directory_path ? { dirPath: directory_path } : {};
        const response = await axios.get(`${this.apiUrl}/directory`, { params });
        return response.data;
    }

    async makeNewDirectory(directory_path) {
        const data = { dirPath: directory_path };
        const response = await axios.post(`${this.apiUrl}/directory`, null, { params: data });
        return response.data;
    }

    //checked unitl here
    
    async splitFile(input_file_path, chunk_size, output_directory) {
        try {
            const fileUri = FileSystem.documentDirectory + input_file_path;
            const file = await FileSystem.readAsStringAsync(fileUri, { encoding: 'base64' });

            if (!(await FileSystem.getInfoAsync(output_directory)).exists) {
                await FileSystem.makeDirectoryAsync(output_directory);
            }

            const chunk_number = 1;
            let start = 0;
            let end = chunk_size;

            while (start < file.length) {
                const chunk_data = file.substring(start, end);
                const chunk_filename = `${output_directory}/${input_file_path}_${chunk_number}.bin`;

                await FileSystem.writeAsStringAsync(
                    chunk_filename,
                    chunk_data,
                    { encoding: FileSystem.EncodingType.Base64 }
                );

                start = end;
                end = start + chunk_size;
            }

            return output_directory;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async mergeChunks(chunks_directory, file_name) {
        try {
            const output_file_path = `${FileSystem.documentDirectory}${file_name}`;
            const output_file = await FileSystem.openAsync(output_file_path, 'wb');

            let chunk_number = 1;
            let chunk_filename = `${chunks_directory}/${file_name}_${chunk_number}.bin`;

            while (await FileSystem.getInfoAsync(chunk_filename)) {
                const chunk_data = await FileSystem.readAsStringAsync(chunk_filename, { encoding: 'base64' });
                await FileSystem.writeAsStringAsync(output_file, chunk_data, { encoding: 'base64' });

                chunk_number++;
                chunk_filename = `${chunks_directory}/${file_name}_${chunk_number}.bin`;
            }

            return output_file_path;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getFileSizeInBytes(file_path) {
        const fileInfo = await FileSystem.getInfoAsync(file_path);
        return fileInfo.size;
    }

    async getMimeType(file_path) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(file_path, { md5: false, mimeType: true });
          return fileInfo.mimeType || null;
        } catch (error) {
          console.error('Error getting MIME type:', error);
          return null;
        }
    }

    async uploadFile(file_local_path, directory_path = '~') {
        try {
            const file_size = await this.getFileSizeInBytes(file_local_path);
            const file_mime_type = await this.getMimeType(file_local_path);
            const file_name = file_local_path.split('/').pop();

            const file_data = await this.addFile(file_name, file_size, file_mime_type, directory_path);

            const file_db_id = file_data.fileId;
            if (!file_db_id) {
                console.error(file_data.error);
                return null;
            }

            console.log('File data sent successfully.');
            const chunks_directory = await this.splitFile(file_local_path, 1024 * 1024 * 20, String(file_db_id));

            if (!chunks_directory) {
                console.error('Error splitting file.');
                return null;
            }

            console.log('File chunks created successfully.');
            if (await this.handleUploading(chunks_directory, file_db_id)) {
                console.log('File uploaded successfully.');
                return file_data;
            } else {
                console.error('Error uploading file.');
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async handleUploading(chunks_dir_path, parent_file_id) {
        try {
            const chunks_list = await FileSystem.readDirectoryAsync(chunks_dir_path);

            for (let chunk_index = 0; chunk_index < chunks_list.length; chunk_index++) {
                const chunk_filename = chunks_list[chunk_index];
                const data = {
                    fileId: parent_file_id,
                };

                const chunk_data = await FileSystem.readAsStringAsync(`${chunks_dir_path}/${chunk_filename}`, {
                    encoding: 'base64',
                });

                await axios.post(`${this.apiUrl}`, data, {
                    headers: { 'Content-Type': 'application/json' },
                    data: { file: chunk_data },
                });
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async downloadFile(file_path) {
        try {
            const file_name = file_path.split('/').pop();
            const file_data = await this.getFileData(file_path);
            console.log('Currently downloading => ', file_name);
            const chunks_id_list = file_data.chunksIds;
            const output_directory = file_name.split('.')[0];

            if (!(await FileSystem.getInfoAsync(output_directory)).exists) {
                await FileSystem.makeDirectoryAsync(output_directory);
            }

            for (let chunk_data_index = 0; chunk_data_index < chunks_id_list.length; chunk_data_index++) {
                const chunk_id = chunks_id_list[chunk_data_index].chunkId;
                const chunk_name = chunks_id_list[chunk_data_index].chunkName;

                const response = await axios.get(`${this.apiUrl}/download`, {
                    params: { chunkId: chunk_id },
                    responseType: 'arraybuffer',
                });

                const chunk_data = Buffer.from(response.data, 'binary').toString('base64');
                await FileSystem.writeAsStringAsync(`${output_directory}/${chunk_name}`, chunk_data, {
                    encoding: FileSystem.EncodingType.Base64,
                });
            }

            return await this.mergeChunks(output_directory, file_name);
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default StorageClient;
