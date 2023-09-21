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