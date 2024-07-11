const { Book, Comment, User } = require("../models");

const getCount = async (req, res) => {
  try {
    const totalBooks = await Book.count();
    const totalClicks = await Book.sum("clicks"); // assuming `clicks` is a field in the `Book` model
    const totalUsers = await User.count({ where: { role: "USER" } });
    const totalAdmins = await User.count({ where: { role: "ADMIN" } });
    const totalComments = await Comment.count();

    res.status(200).json({
      totalBooks,
      totalClicks,
      totalUsers,
      totalAdmins,
      totalComments,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getCount };
