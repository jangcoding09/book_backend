const { BannedWord, Comment } = require("../models");

// Endpoint to add a new banned word
const addBannedWord = async (req, res) => {
  try {
    const { word } = req.body;
    await BannedWord.create({ word });
    const bannedWords = await BannedWord.findAll();
    res.status(201).json(bannedWords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to delete a banned word and return all banned words
const deleteBannedWord = async (req, res) => {
  try {
    const { id } = req.params;
    await BannedWord.destroy({ where: { id } });
    const bannedWords = await BannedWord.findAll();
    res.status(200).json(bannedWords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Endpoint to get all banned words
const getBannedWords = async (req, res) => {
  try {
    const bannedWords = await BannedWord.findAll();
    res.status(200).json(bannedWords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addBannedWord,
  deleteBannedWord,
  getBannedWords,
};
