import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
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
    password: {
      type: String,
      required: [
        function () { return !this.googleId; },
        "Password is required for non-Google accounts",
      ],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        label: { type: String, trim: true },
        street: { type: String, trim: true },
        city:   { type: String, trim: true },
        state:  { type: String, trim: true },
        pincode:{ type: String, trim: true },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    refreshToken: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Hash password — use next() for safety across all Mongoose versions
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
  // next();
});

// ✅ comparePassword — guard against undefined hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;