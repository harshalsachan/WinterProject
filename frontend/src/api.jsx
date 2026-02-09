const API_BASE_URL = 'http://localhost:3000'; 

const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const createRoomApi = async (username) => {
  try {
  const response = await fetch(`${API_BASE_URL}/room/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create room');
  
  return { 
    success: true, 
    roomCode: data.RoomID 
  }; 
  } 
  catch (error) {
  console.error("API Error (createRoom):", error);
  throw error;
  }
};

export const joinRoomApi = async (roomId, username) => {
  try {
  const response = await fetch(`${API_BASE_URL}/room/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ RoomID: roomId, username }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to join room');

  return { success: true, roomCode: roomId };
  } catch (error) {
  console.error("API Error (joinRoom):", error);
  throw error;
  }
};

export const uploadFileApi = async (file) => {
  try {
  const base64Data = await toBase64(file);

  const response = await fetch(`${API_BASE_URL}/file/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileData: base64Data
    }),
  });

  const data = await response.json();
  if (!data.fileID) throw new Error(data.error || 'Upload failed');
  
  return data;

  } catch (error) {
  console.error("API Upload Error:", error);
  throw error;
  }
};

export const downloadFileApi = async (fileId) => {
  try {
  const response = await fetch(`${API_BASE_URL}/file/download/${fileId}`);
  const data = await response.json();
  
  if (!data.success) throw new Error(data.message);
  
  return data;
  } catch (error) {
  console.error("API Download Error:", error);
  throw error;
  }
};

