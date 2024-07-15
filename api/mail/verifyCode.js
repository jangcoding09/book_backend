require("dotenv").config();

module.exports = async (req, res) => {
  const { email, code } = req.body;

  try {
    if (global.verificationCodes && global.verificationCodes[email]) {
      const storedCode = global.verificationCodes[email].code;

      if (code === storedCode) {
        res
          .status(200)
          .json({ message: "Verification code matched. Proceed with signup." });
      } else {
        res.status(400).json({ message: "Verification code does not match." });
      }
    } else {
      res.status(400).json({ message: "Verification code not found." });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Failed to verify code." });
  }
};
