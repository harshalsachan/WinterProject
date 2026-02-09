const pako = require('pako');

function dataCompression(data) {
  const compressedData = pako.gzip(data);
  return Buffer.from(compressedData).toString('base64');
}

function decompressData(compressedBase64) {
  const compressed = Buffer.from(compressedBase64, 'base64');
  const decompressed = pako.ungzip(compressed);
  return Buffer.from(decompressed).toString('utf8');
}

function chunkData(data, chunkSize = 100000) {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.substring(i, i + chunkSize));
  }
  return chunks;
}

exports.uploadFile = (req, res) => {
  try {
    const { fileName, fileType, fileSize, fileData } = req.body;
    const gun = global.gun;
    
    const fileID = Date.now() + '-' + Math.random().toString(36).substring(7);

    console.log(`📤 Processing Upload: ${fileName} (${fileSize} bytes)`);

    const compressedData = dataCompression(fileData);
    const chunks = chunkData(compressedData);
    
    const fileMetaData = {
      fileId: fileID,
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,
      chunksCount: chunks.length,
      uploadedAt: Date.now()
    };

    gun.get('files').get(fileID).put({ metadata: fileMetaData });

    for (let i = 0; i < chunks.length; i++) {
      gun.get('files').get(fileID).get('chunks').get(i.toString()).put({
        chunkData: chunks[i],
        index: i
      });
    }

    console.log(`✅ File Compressed & Stored. ID: ${fileID}`);

    res.json({
      status: 'success',
      fileMetaData: fileMetaData,
      fileID: fileID
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: error.message });
  }
};

exports.getFile = (req, res) => {
  try {
    const fileId = req.params.fileId;
    const gun = global.gun;
    
    console.log(`📥 Fetching file: ${fileId}`);

    gun.get('files').get(fileId).get('metadata').once((metadata) => {
      if (!metadata || !metadata.fileId) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }

      const totalChunks = metadata.chunksCount;
      let loadedChunks = [];
      let retrievedCount = 0;

      const timeout = setTimeout(() => {
        if (retrievedCount < totalChunks) {
           res.status(500).json({ success: false, message: 'Timeout fetching chunks' });
        }
      }, 15000);

      for (let i = 0; i < totalChunks; i++) {
        gun.get('files').get(fileId).get('chunks').get(i.toString()).once((data) => {
          if (data && data.chunkData) {
            loadedChunks[data.index] = data.chunkData;
            retrievedCount++;

            if (retrievedCount === totalChunks) {
              clearTimeout(timeout);
              
              try {
                const fullCompressed = loadedChunks.join('');
                const finalData = decompressData(fullCompressed);

                res.json({
                  success: true,
                  fileName: metadata.fileName,
                  fileType: metadata.fileType,
                  fileData: finalData
                });

              } catch (err) {
                 res.status(500).json({ success: false, message: 'Decompression failed' });
              }
            }
          }
        });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};





