const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require("../../utils/uploadImage");
const { Image } = require("../../models");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();

  upload.single("profileImage")(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send({ error: "No files uploaded" });
      }
      const uploadResult = await uploadImage(file);

      const imageRecord = {
        path: uploadResult.publicUrl,
        fbPath: uploadResult.filePath,
        order: 1,
        type: 2,
      };
      const uploadedImage = await Image.create(imageRecord);
      res
        .status(200)
        .send({ imageId: uploadedImage.id, imagePath: uploadedImage.path });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).send({ error: error.message });
    }
  });
};
