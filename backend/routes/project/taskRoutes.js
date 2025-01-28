const express = require('express');
const authenticateUser = require('../../middlewares/authenticateUser');
// const validateTaskData = require("../../middlewares/validateTask");
const { fetchProjectTasks, createProjectTask, updateProjectTask, deleteProjectTask } = require('../../services/taskService');
const { fetchProjectTaskById } = require('../../services/taskService');
const validateTaskData = require('../../middlewares/validateTask');

const router = express.Router({ mergeParams: true }); // to access :projectId

router.get('/', [authenticateUser], async (req, res) => {
	try {
		const userId = req.user.id;
		const projectId = req.params.projectId;
		const tasks = await fetchProjectTasks(userId, projectId);
		res.json(tasks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.get('/:taskId', [authenticateUser], async (req, res) => {
	try {
		const userId = req.user.id;
		const projectId = req.params.projectId;
		const taskId = req.params.taskId;
		const task = await fetchProjectTaskById(userId, projectId, taskId);
		res.json(task);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.post('/', [authenticateUser, validateTaskData], async (req, res) => {
	try {
		const userId = req.user.id;
		const projectId = req.params.projectId;
		const newTask = req.body;
		const task = await createProjectTask(userId, projectId, newTask);
		res.status(201).json(task);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.put('/:taskId', [authenticateUser, validateTaskData], async (req, res) => {
	try {
		const userId = req.user.id;
		const projectId = req.params.projectId;
		const taskId = req.params.taskId;
		const updatedTask = req.body;
		const task = await updateProjectTask(userId, projectId, taskId, updatedTask);
		res.json(task);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.delete('/:taskId', authenticateUser, async (req, res) => {
	try {
		const userId = req.user.id;
		const projectId = req.params.projectId;
		const taskId = req.params.taskId;
		await deleteProjectTask(userId, projectId, taskId);
		res.json({ message: 'Task deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
