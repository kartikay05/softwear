import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    avatar: {
      type: String,
      default: "https://ik.imagekit.io/krt/boy.png",
    },

    contact: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false,
    },

    role: {
      type: String,
      enum: ["Buyer", "Seller", "Admin"],
      default: "Buyer",
    },

    googleId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
