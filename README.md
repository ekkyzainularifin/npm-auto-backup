
# Auto backup Database to Google Drive v1.2.10

This package makes it easy for you to backup your database to your Google drive automatically.

before using this package you need to prepare google api credentials and place it in your root directory as file **credentials.json**

then prepare env as below, fill in the value according to what you have



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
`DB_HOST=`

`DB_PORT=` 

`DB_USER=`

`DB_DATABASE=`

`DB_PASSWORD=`

`GOOGLE_DRIVE_FOLDER_ID=`



## Usage/Examples

```javascript
const autoBackup = require('@ekkyzainularifin/auto-backup');

function backupData() {
  return autoBackup.backup();
}

function uploadBackup() {
   return autoBackup.upload();
}

async function autoBackupUpload() {
    await autoBackup.backup();
    await autoBackup.upload();
}

autoBackupUpload();
```