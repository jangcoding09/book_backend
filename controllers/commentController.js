const { User, Book, Comment, Bannedword } = require("../models");

const containsBannedWord = async (content) => {
  const bannedWords = await Bannedword.findAll();
  return bannedWords.some((word) => content.includes(word.word));
};

const getcommentsForBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const page = parseInt(req.query.page) || 1;
    const take = parseInt(req.query.take) || 5;
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    // 댓글 검색 및 페이지네이션
    const { count, rows } = await Comment.findAndCountAll({
      where: { bookId },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "profileImg"] },
      ],
      order: [["createdAt", "DESC"]],
      limit: take,
      offset: (page - 1) * take,
    });

    res.send({
      data: rows,
      total: count,
      page,
      take,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
// 새로운 댓글을 추가하는 함수
const postcomment = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (await containsBannedWord(content)) {
      return res
        .status(400)
        .json({ error: "Comment contains inappropriate content" });
    }

    const comment = await Comment.create({
      content,
      userId,
      bookId,
    });

    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "profileImg"] },
      ],
    });

    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 특정 댓글을 수정하는 함수
const patchcomment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;
    const { content } = req.body;

    if (await containsBannedWord(content)) {
      return res
        .status(400)
        .json({ error: "Comment contains inappropriate content" });
    }

    const comment = await Comment.findOne({
      where: {
        id: commentId,
        bookId: bookId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.content = content;
    await comment.save();

    const updatedComment = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "profileImg"] },
      ],
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 특정 댓글을 삭제하는 함수
const deletecomment = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;

    const comment = await Comment.findOne({
      where: {
        id: commentId,
        bookId: bookId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await comment.destroy();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteCommentByRole = async (req, res) => {
  try {
    const { commentId, userId } = req.params;

    // Find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has the required role
    if (!user.role.includes("ADMIN")) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this comment" });
    }

    // Find the comment by commentId
    const comment = await Comment.findOne({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    await comment.destroy();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 특정 책의 댓글을 페이징하여 가져오는 함수
const getcomments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const take = parseInt(req.query.take) || 10;

    // Fetch books and their comments
    const books = await Book.findAll({
      include: {
        model: Comment,
        as: "comments",
        include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      },
    });

    const data = books.map((book) => ({
      commentId: book.id,
      commentArray: book.comments,
      total: book.comments.length,
      bookTitle: book.title,
    }));

    const total = data.length;

    // Paginate the response
    const paginatedData = data.slice((page - 1) * take, page * take);

    res.status(200).json({
      data: paginatedData,
      total,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getcommentsForBook,
  postcomment,
  patchcomment,
  deletecomment,
  getcomments,
  containsBannedWord,
  deleteCommentByRole,
};
