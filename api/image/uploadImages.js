const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require("../../utils/uploadImage");
const { Image } = require("../../models");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();

  upload.array("images", 10)(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).send({ error: "No files uploaded" });
      }

      const imageUploadPromises = files.map((file) => uploadImage(file));
      const uploadResults = await Promise.all(imageUploadPromises);

      const imageRecords = uploadResults.map((result, index) => ({
        path: result.publicUrl,
        fbPath: result.filePath,
        order: index + 1,
        type: 1, // 예시로 타입을 지정했습니다. 실제 사용 시 적절히 변경하세요.
      }));

      const uploadedImages = await Image.bulkCreate(imageRecords);
      const uploadedImagePaths = uploadedImages.map((image) => image.path);
      const uploadedImageIds = uploadedImages.map((image) => image.id);

      res
        .status(200)
        .send({ imageIds: uploadedImageIds, imagePaths: uploadedImagePaths });
    } catch (error) {
      console.error("Error uploading images:", error);
      res.status(500).send({ error: error.message });
    }
  });
};
