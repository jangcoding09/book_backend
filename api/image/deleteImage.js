const { Image, Book } = require("../../models");
const { removeImage } = require("../../utils/removeImage");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();

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
};
