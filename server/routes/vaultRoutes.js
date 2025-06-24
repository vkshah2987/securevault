const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const vaultController = require('../controllers/vaultController');

router.post('/create', authMiddleware, vaultController.createPassword);
router.get('/all', authMiddleware, vaultController.getPasswords);
router.put('/:id', authMiddleware, vaultController.updatePassword);
router.delete('/:id', authMiddleware, vaultController.deletePassword);
router.post('/validate-key', authMiddleware, vaultController.validateVaultKey);

module.exports = router
