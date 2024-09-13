const { bucket } = require("../firbase");

const { v4: uuidv4 } = require("uuid");
const uploadImage = async (file) => {
  const fileName = `${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(fileName);
  const blobStream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => reject(error));

    blobStream.on("finish", async () => {
      try {
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve({ publicUrl, filePath: fileUpload.name });
      } catch (error) {
        reject(error);
      }
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { uploadImage };
