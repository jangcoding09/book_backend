const { Bannedword, Comment } = require("../models");

// Endpoint to add a new banned word
const addBannedWord = async (req, res) => {
  try {
    const { word } = req.body;
    await Bannedword.create({ word });
    const Bannedwords = await Bannedword.findAll();
    res.status(201).json(Bannedwords);
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
    res.status(200).json(bannedwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to get all banned words
const getBannedWords = async (req, res) => {
  try {
    const bannedwords = await Bannedword.findAll();
    res.status(200).json(bannedwords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBannedWord,
  deleteBannedWord,
  getBannedWords,
};
