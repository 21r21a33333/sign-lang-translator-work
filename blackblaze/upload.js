const B2 = require('b2');
const fs = require('fs');
const path = require('path');

const B2Client = new B2({
    accountId: 'YOUR_ACCOUNT_ID',
    applicationKey: 'YOUR_APPLICATION_KEY'
  });

  async function uploadFile(bucketId, filePath) {
    const fileName = path.basename(filePath);
  
    try {
      const fileData = fs.readFileSync(filePath);
      const response = await B2Client.uploadFile({
        bucketId: bucketId,
        fileName: fileName,
        data: fileData
      });
  
      console.log(`Uploaded file ${fileName}`);
    } catch (error) {
      console.error(`Error uploading file ${fileName}: ${error}`);
    }
  }

  async function uploadMultipleFiles(bucketId, filePaths) {
    for (const filePath of filePaths) {
      await uploadFile(bucketId, filePath);
    }
  }

  const bucketId = 'YOUR_BUCKET_ID';
const filePaths = [
  '/path/to/file1.txt',
  '/path/to/file2.txt',
  '/path/to/file3.txt'
];

uploadMultipleFiles(bucketId, filePaths)
  .then(() => {
    console.log('All files uploaded successfully.');
  })
  .catch(error => {
    console.error('Error uploading files:', error);
  });
