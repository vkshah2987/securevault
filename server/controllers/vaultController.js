const Password = require('../models/Password');

// Create
exports.createPassword = async (req, res) => {
    try {
        const { title, username, encryptedPassword, tags } = req.body;
        const newEntry = new Password({
            userId: req.user,
            title,
            username,
            encryptedPassword,
            tags
        });
        await newEntry.save();
        res.status(201).json({ message: 'Password save successfully' });
    } catch (err) {
        res.status(500).json({ message: `Error saving password. Detail: ${err}` });
    }
};

// Read
exports.getPasswords = async (req, res) => {
    try {
        const passwords = await Password.find({ userId: req.user }).sort({ createdAt: -1 });
        res.status(200).json(passwords);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching passwords' });
    }
};

// Update
exports.updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Password.findOneAndUpdate(
            { _id: id, userId: req.user },
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating password' })
    }
};

// Delete
exports.deletePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Password.findOneAndDelete({ _id: id, userId: req.user });
        if (!deleted) return res.status(404).json({ message: 'Entry not found' });
        res.status(200).json({ message: 'Password deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting password' });
    }
};