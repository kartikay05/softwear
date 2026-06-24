import userModel from "../models/user.model.js";

export function findUserByEmail(email, projection = "") {
    return userModel.findOne({ email }).select(projection);
}

export function findUserById(userId, projection = "") {
    return userModel.findById(userId).select(projection);
}

export function createUser(payload) {
    return userModel.create(payload);
}

export function updateUserById(userId, update, options = { new: true }) {
    return userModel.findByIdAndUpdate(userId, update, options);
}

export function clearRefreshToken(refreshToken) {
    return userModel.findOneAndUpdate(
        { refreshToken },
        { $unset: { refreshToken: 1 } }
    );
}
