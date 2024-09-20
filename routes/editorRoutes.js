const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require("../utils/uploadImage");
const { Image } = require("../models");

router.post("/", upload.single("editorImage"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send({ error: "No files uploaded" });
    }
    const uploadResult = await uploadImage(file);

    const imageRecord = {
      path: uploadResult.publicUrl,
      fbPath: uploadResult.filePath,
      type: file.mimetype,
      size: file.size,
      name: file.originalname,
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

module.exports = router;
