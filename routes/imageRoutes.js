const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { uploadImage } = require("../utils/uploadImage");
const { Image, Book } = require("../models");
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
const removeImage = async (path) => {
  try {
    await bucket.file(path).delete();
    console.log(`Image at path ${path} deleted successfully`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
//이미지 삭제(imageId를 받아서 처리)
router.delete("/temp/:bookId/:imageId", async (req, res) => {
  try {
    const { bookId, imageId } = req.params;

    // bookId로 해당 책 조회
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    // 책의 imageIds 필드에서 imageId 제거
    const imageIds = book.imageIds || [];
    const updatedImageIds = imageIds.filter((id) => id !== imageId);

    // 수정된 imageIds를 데이터베이스에 업데이트
    book.imageIds = updatedImageIds;
    await book.save();

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
