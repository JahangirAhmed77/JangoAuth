import userModel from '../models/usermodel.js';

export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, userData: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};