const pako = require('pako');

// --- HELPER FUNCTIONS ---
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

// --- EXPORT 1: UPLOAD FILE ---
exports.uploadFile = (req, res) => {
  try {
    const { fileName, fileType, fileSize, fileData } = req.body;
    const gun = global.gun;
    
    // Generate ID
    const fileID = Date.now() + '-' + Math.random().toString(36).substring(7);
    console.log(`📤 Uploading: ${fileName} (${fileSize} bytes)`);

    // 1. Compress & Chunk
    const compressedData = dataCompression(fileData);
    const chunks = chunkData(compressedData);
    
    // 2. Store Metadata
    const fileMetaData = {
      fileId: fileID,
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,
      chunksCount: chunks.length,
      uploadedAt: Date.now()
    };
    gun.get('files').get(fileID).put({ metadata: fileMetaData });

    // 3. Store Chunks
    for (let i = 0; i < chunks.length; i++) {
      gun.get('files').get(fileID).get('chunks').get(i.toString()).put({
        chunkData: chunks[i],
        index: i
      });
    }

    console.log(`✅ Stored. ID: ${fileID}`);
    res.json({ status: 'success', fileMetaData, fileID });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: error.message });
  }
};

// --- EXPORT 2: GET FILE (With Timeout Fix) ---
exports.getFile = (req, res) => {
  try {
    const fileId = req.params.fileId;
    const gun = global.gun;
    
    console.log(`📥 Fetching file: ${fileId}`);

    // 1. Get Metadata first
    gun.get('files').get(fileId).get('metadata').once((metadata) => {
      if (!metadata || !metadata.fileId) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }

      console.log(`📄 Metadata: ${metadata.fileName} (${metadata.chunksCount} chunks)`);

      const totalChunks = metadata.chunksCount;
      let loadedChunks = [];
      let retrievedCount = 0;
      let hasResponded = false; 

      // Timeout: 60 seconds
      const timeout = setTimeout(() => {
        if (!hasResponded) {
           hasResponded = true;
           console.log("❌ Download Timed Out!");
           res.status(500).json({ success: false, message: 'Timeout fetching chunks' });
        }
      }, 60000); 

      // 2. Loop to get all chunks
      for (let i = 0; i < totalChunks; i++) {
        gun.get('files').get(fileId).get('chunks').get(i.toString()).once((data) => {
          
          if (hasResponded) return; 

          if (data && data.chunkData) {
            loadedChunks[data.index] = data.chunkData; 
            retrievedCount++;

            // Log progress every 10%
            if (retrievedCount % Math.ceil(totalChunks / 10) === 0) {
                console.log(`⏳ Progress: ${retrievedCount}/${totalChunks}...`);
            }

            if (retrievedCount === totalChunks) {
              clearTimeout(timeout);
              hasResponded = true;
              
              try {
                console.log("🧩 Reassembling...");
                const fullCompressed = loadedChunks.join('');
                const finalData = decompressData(fullCompressed);

                console.log("✅ Sending file!");
                res.json({
                  success: true,
                  fileName: metadata.fileName,
                  fileType: metadata.fileType,
                  fileData: finalData 
                });

              } catch (err) {
                 console.error("Decompression Error:", err);
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