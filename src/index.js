const { spawn } = require("child_process");
const moment = require('moment');
const { config } = require('dotenv').config();
const fs = require("fs");
const path = require('path');
const zlib = require("zlib");
const { google } = require('googleapis');

const envFilePath = path.join('./.env');
const backupFileName = path.join('./backup');
const key = require('../../../../credentials.json');
const fileBackupName = `${moment().format('DD-MM-YYYY')}.sql.gz`

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  gdriveFolderId : process.env.GOOGLE_DRIVE_FOLDER_ID,
};
const backupAuto = {
  backup: function backup() {

    return new Promise((resolve,reject) => {
      fs.readdirSync(backupFileName).forEach(f => fs.rmSync(`${backupFileName}/${f}`));

      const backupProcess = spawn('mysqldump', [`--host=${dbConfig.host}`, `--user=${dbConfig.user}`,`--password=${dbConfig.password}`, dbConfig.database]);
      const writeStream = fs.createWriteStream(`${backupFileName}/${fileBackupName}`);
      const gzip = zlib.createGzip();
        
      backupProcess.stdout.pipe(gzip).pipe(writeStream);
      backupProcess.on('exit', () => {
        console.log('Backup created successfully!');
        resolve(true);
      });
    })
  },

  upload: function () {  
    // Create an instance of the Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({
      version: 'v3',
      auth: auth,
    });

    const fileMetadata = {
      name: fileBackupName,
      parents: [dbConfig.gdriveFolderId]
    };
    const media = {
      mimeType: 'application/gzip',
      body: fs.createReadStream(`./backup/${fileBackupName}`),
    };
    
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    }, (err, file) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`File ID: ${file.data.id}`);
      }
    });
  },
};


module.exports = backupAuto;