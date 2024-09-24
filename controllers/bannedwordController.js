const { Bannedword, Comment } = require("../models");

// Endpoint to add a new banned word
const addBannedWord = async (req, res) => {
  try {
    const { word } = req.body;
    await Bannedword.create({ word });
    const bannedwords = await Bannedword.findAll();
    const total = await Bannedword.count();
    res.status(201).json({ data: bannedwords, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to delete a banned word and return all banned words
const deleteBannedWord = async (req, res) => {
  try {
    const { id } = req.params;
    await Bannedword.destroy({ where: { id } });
    const bannedwords = await Bannedword.findAll();
    const total = await Bannedword.count();
    res.status(200).json({ data: bannedwords, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to get all banned words with pagination
const getBannedWords = async (req, res) => {
  try {
    const { take = 10, page = 1 } = req.query;
    const offset = (page - 1) * take;
    const bannedwords = await Bannedword.findAll({
      limit: parseInt(take),
      offset: parseInt(offset),
    });
    const total = await Bannedword.count();
    res.status(200).json({
      data: bannedwords,
      total,
      page: parseInt(page),
      take: parseInt(take),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBannedWord,
  deleteBannedWord,
  getBannedWords,
};
