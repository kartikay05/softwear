import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import config from "../config/config.js";

/**
 * Generates JWT token and sets it as an HTTP-only cookie.
 * @param {Object} user - User document
 * @param {Object} res - Express response object
 * @returns {String} Signed JWT token
 */
function generateTokenAndSetCookie(user, res) {
  const token = jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
}

/**
 * Helper to send successful authentication response with user data.
 */
async function sendTokenResponse(user, res, message) {
  generateTokenAndSetCookie(user, res);

  res.status(200).json({
    success: true,
    message,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullName: user.fullName,
      role: user.role || "Buyer",
      avatar: user.avatar,
    },
  });
}

/**
 * Register a new user (Buyer or Seller)
 */
export async function register(req, res) {
  const { fullName, email, password, contact, isSeller } = req.body;

  try {
    const queryConditions = [{ email }];
    if (contact) queryConditions.push({ contact });

    const isUserExists = await userModel.findOne({
      $or: queryConditions,
    });

    if (isUserExists) {
      return res.status(400).json({ 
        success: false, 
        message: "User with this email or contact number already exists" 
      });
    }

    const user = await userModel.create({
      fullName,
      email,
      password,
      contact: contact || "",
      role: isSeller ? "Seller" : "Buyer",
    });

    await sendTokenResponse(user, res, "User registered successfully");
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Log in an existing user
 */
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    await sendTokenResponse(user, res, "User logged in successfully");
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Google OAuth Callback
 * Logs in the user if they already exist (linking their accounts if needed),
 * or creates a new user if they do not exist.
 */
export async function googleCallback(req, res) {
  try {
    if (!req.user) {
      return res.redirect(`${config.CLIENT_URL}/login?error=NoUserFromGoogle`);
    }

    const { id, displayName, emails, photos } = req.user;
    const email = emails?.[0]?.value;
    const photo = photos?.[0]?.value;

    if (!email) {
      return res.redirect(`${config.CLIENT_URL}/login?error=EmailRequired`);
    }

    let user = await userModel.findOne({ email });

    if (user) {
      // User exists - link Google ID and avatar if needed
      let updated = false;
      if (!user.googleId) {
        user.googleId = id;
        updated = true;
      }
      if (photo && (!user.avatar || user.avatar.includes("flaticon.com"))) {
        user.avatar = photo;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      // Create new user
      user = await userModel.create({
        email,
        googleId: id,
        fullName: displayName || "Google User",
        avatar: photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        role: "Buyer",
      });
    }

    generateTokenAndSetCookie(user, res);
    res.redirect(config.CLIENT_URL);
  } catch (error) {
    console.error("Error inside googleCallback:", error);
    res.redirect(`${config.CLIENT_URL}/login?error=OAuthFailed`);
  }
}

/**
 * Get the currently logged-in user profile
 */
export async function getProfile(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "User profile not found" });
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
    },
  });
}

/**
 * Log out a user by clearing their cookies
 */
export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}


