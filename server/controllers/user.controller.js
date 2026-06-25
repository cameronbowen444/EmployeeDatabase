const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isApproved: user.isApproved,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const userResponse = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isApproved: user.isApproved,
  };
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports.register = async (request, response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      permissionCode,
    } = request.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return response.status(400).json({
        err: {
          errors: {
            email: {
              message: "This email is already registered.",
            },
          },
        },
      });
    }

    const isApproved = permissionCode === process.env.PERMISSION_CODE;

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      isApproved,
    });

    if (!user.isApproved) {
      return response.status(403).json({
        message: "Invalid permission code. Account created but not approved.",
        user: userResponse(user),
      });
    }

    const userToken = createToken(user);

    response.cookie("usertoken", userToken, cookieOptions).json({
      message: "Registration successful.",
      user: userResponse(user),
    });
  } catch (err) {
    response.status(400).json({ err });
  }
};

module.exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return response.status(400).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.isApproved) {
      return response.status(403).json({
        message: "Your account is not approved. Please use the correct permission code.",
      });
    }

    const userToken = createToken(user);

    response.cookie("usertoken", userToken, cookieOptions).json({
      message: "Login successful.",
      user: userResponse(user),
    });
  } catch (err) {
    response.status(400).json({ err });
  }
};

module.exports.logout = (request, response) => {
  response
    .clearCookie("usertoken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      message: "Logout successful.",
    });
};

module.exports.getLoggedInUser = async (request, response) => {
  try {
    const decodedToken = jwt.verify(
      request.cookies.usertoken,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedToken.id).select("-password");

    if (!user) {
      return response.status(404).json({
        message: "User not found.",
      });
    }

    response.json({
      user: userResponse(user),
    });
  } catch (err) {
    response.status(401).json({
      message: "Not logged in.",
    });
  }
};