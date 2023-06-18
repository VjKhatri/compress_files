import React, { useState } from 'react';

function Details() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFileUploaded(false);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          setIsFileUploaded(true);
          setSelectedFile(null);
        } else {
          throw new Error('File upload failed');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <input type="file" name="file" onChange={changeHandler} />
      {selectedFile && (
        <div>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{' '}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      )}
      {isFileUploaded ? (
        <p>Image uploaded successfully!</p>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
}

export default Details;
