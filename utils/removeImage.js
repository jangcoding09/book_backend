const { bucket } = require("../firbase");

const removeImage = async (path) => {
  try {
    await bucket.file(path).delete();
    console.log(`Image at path ${path} deleted successfully`);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

module.exports = { removeImage };
