import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';
import { uniqueId } from 'lodash';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    uploadedFiles.map(uploadedFile =>
      data.append('file', uploadedFile.file, uploadedFile.name),
    );

    try {
      await api.post('/transactions/import', data);

      setUploadedFiles([]);
      setUploadStatus('Arquivos enviados');
    } catch (err) {
      console.log(err.response.error);
      setUploadedFiles([]);
      setUploadStatus('A importação falhou');
    }
  }

  function submitFile(files: File[]): void {
    setUploadStatus('');

    const uploadedFilesList = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(uploadedFilesList);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
          {!!uploadStatus && <span>{uploadStatus}</span>}
          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
