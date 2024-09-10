const jwt = require("jsonwebtoken");

// Middleware to authenticate user and extract userId from JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Expect the token in 'Bearer <token>' format

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
    req.user = decoded; // Store the decoded token (contains user information) in req.user
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
