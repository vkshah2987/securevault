const Password = require('../models/Password');
const User = require('../models/User');

// Create
// exports.createPassword = async (req, res) => {
//     try {
//         const { title, username, encryptedPassword, tags } = req.body;
//         const newEntry = new Password({
//             userId: req.user,
//             title,
//             username,
//             encryptedPassword,
//             tags
//         });
//         await newEntry.save();
//         res.status(201).json({ message: 'Password save successfully' });
//     } catch (err) {
//         res.status(500).json({ message: `Error saving password. Detail: ${err}` });
//     }
// };

// Create new vault entry & set vaultValidation if it's user's first
exports.createPassword = async (req, res) => {
    try {
        const { title, username, encryptedPassword, tags, encryptedVaultCheck } = req.body;

        // Save password entry
        const newEntry = new Password({
            userId: req.user,
            title,
            username,
            encryptedPassword,
            tags
        });
        await newEntry.save();

        // Check if user has vaultValidation set
        const user = await User.findById(req.user);
        if (!user.vaultValidation && encryptedVaultCheck) {
            user.vaultValidation = encryptedVaultCheck;
            await user.save();
        }

        res.status(201).json({ message: 'Password saved successfully' });
    } catch (err) {
        console.error('Error in createPassword:', err);
        res.status(500).json({ message: `Error saving password. Detail: ${err.message}` });
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

// ✅ Passphrase validation controller
exports.validateVaultKey = async (req, res) => {
    try {
        const { encryptedTest } = req.body;
        if (!encryptedTest) {
            return res.status(400).json({ error: 'Missing encryptedTest' });
        }

        const user = await User.findById(req.user); // req.user is userId from token
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.vaultValidation) {
            return res.status(400).json({ error: 'Vault passphrase not yet set' });
        }

        if (encryptedTest === user.vaultValidation) {
            return res.status(200).json({ valid: true });
        } else {
            return res.status(403).json({ error: 'Invalid passphrase' });
        }
    } catch (err) {
        console.error('Vault key validation error:', err);
        res.status(500).json({ error: 'Server error' });
    }
};