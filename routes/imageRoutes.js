const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require("../utils/uploadImage");
const { Image, Book, Story } = require("../models");
const { bucket } = require("../firbase");
router.post(
  "/temp/profile",
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send({ error: "No files uploaded" });
      }
      const uploadResult = await uploadImage(file);

      const imageRecord = {
        path: uploadResult.publicUrl,
        fbPath: uploadResult.filePath,
        order: index + 1,
        type: file.type,
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
  }
);
router.post("/temp", upload.array("images", 10), async (req, res) => {
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
      type: 1,
      size: files[index].size,
      name: files[index].originalname,
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
const removeImage = async (path) => {
  try {
    await bucket.file(path).delete();
    console.log(`Image at path ${path} deleted successfully`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

router.delete("/temp/:type/:id/:imageId", async (req, res) => {
  try {
    const { type, id, imageId } = req.params;

    let item;
    if (type === "book") {
      // bookId로 해당 책 조회
      item = await Book.findByPk(id);
    } else if (type === "story") {
      // storyId로 해당 스토리 조회
      item = await Story.findByPk(id);
    } else {
      return res.status(400).send({ error: "Invalid type parameter" });
    }

    if (!item) {
      return res.status(404).send({
        error: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`,
      });
    }

    // item의 imageIds 필드에서 imageId 제거
    const imageIds = item.imageIds || [];
    const updatedImageIds = imageIds.filter((id) => id !== imageId);

    // 수정된 imageIds를 데이터베이스에 업데이트
    item.imageIds = updatedImageIds;
    await item.save();

    // 이미지 삭제 로직
    const image = await Image.findByPk(imageId);

    if (!image) {
      return res.status(404).send({ error: "Image not found" });
    }

    await removeImage(image.fbPath);
    await image.destroy();

    res.status(200).send({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).send({ error: error.message });
  }
});
// router.patch("/temp/:bookId", upload.array("images", 10), async (req, res) => {
//   try {
//     const { bookId } = req.params;
//     const { imageIds } = req.body;

//     const book = await Book.findByPk(bookId);
//     if (!book) {
//       return res.status(404).send({ error: "Book not found" });
//     }

//     // 책의 imageIds 필드 업데이트
//     book.imageIds = imageIds;
//     await book.save();

//     const updatedImages = await Image.findAll({ where: { bookId: bookId } });
//     const updatedImagePaths = updatedImages.map((image) => image.fbPath);
//     const updatedImageIds = updatedImages.map((image) => image.id);

//     res
//       .status(200)
//       .send({ imageIds: updatedImageIds, imagePaths: updatedImagePaths });
//   } catch (error) {
//     console.error("Error updating book images:", error);
//     res.status(500).send({ error: error.message });
//   }
// });
module.exports = router;
