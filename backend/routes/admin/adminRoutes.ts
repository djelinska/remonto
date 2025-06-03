import express, {Response} from 'express';

import AppError from '../../utils/AppError';
import AuthRequest from '../../types/models/authRequest.dto';
import {Types} from 'mongoose';
import authenticateAdmin from '../../middlewares/authenticateAdmin';
import authenticateUser from '../../middlewares/authenticateUser';
import templateService from '../../services/templateService';
import userService from '../../services/userService';

const router = express.Router();

router.get('/api/templates', [authenticateUser], async (req: AuthRequest, res: Response) => {
	try {
		const templates = await templateService.fetchTemplates();
		res.status(200).json(templates);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.get('/api/admin/templates/:templateId', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	const {templateId} = req.params;
	if (!templateId) {
		throw new AppError('Template id not found in request', 400);
	}

	try {
		const template = await templateService.fetchTemplateById(new Types.ObjectId(templateId));
		res.status(200).json(template);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.post('/api/admin/templates', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	try {
		const newTemplate = await templateService.createTemplate(req.body);
		res.status(201).json(newTemplate);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.patch('/api/admin/templates/:templateId', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	const {templateId} = req.params;
	if (!templateId) {
		throw new AppError('Template id not found in request', 400);
	}

	try {
		const updatedTemplate = await templateService.updateTemplate(new Types.ObjectId(templateId), req.body);
		res.status(200).json(updatedTemplate);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.delete('/api/admin/templates/:templateId', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	const {templateId} = req.params;
	if (!templateId) {
		throw new AppError('Template id not found in request', 400);
	}

	try {
		await templateService.deleteTemplate(new Types.ObjectId(templateId));
		res.status(200).json({message: 'Template deleted successfully'});
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.get('/api/admin/users', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	try {
		const users = await userService.fetchUsers();
		res.status(200).json(users);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.post('/api/admin/users', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	try {
		const newUser = await userService.createUserProfile(req.body);
		res.status(201).json(newUser);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.patch('/api/admin/users/:userId', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	const {userId} = req.params;
	if (!userId) {
		throw new AppError('User id not found in request', 400);
	}

	try {
		const updatedUser = await userService.updateUserProfile(userId.toString(), req.body);
		res.status(200).json(updatedUser);
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

router.delete('/api/admin/users/:userId', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
	const {userId} = req.params;
	if (!userId) {
		throw new AppError('User id not found in request', 400);
	}

	try {
		await userService.deleteUserProfile(userId.toString());
		res.status(200).json({message: 'Konto zostało usunięte'});
	} catch (error: any) {
		console.error(error);
		return res.status(500).json({message: 'Server error'});
	}
});

export default router;
