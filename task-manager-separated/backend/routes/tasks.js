const express = require('express');
const TaskService = require('../data/tasks');

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get('/', (req, res) => {
    try {
        const tasks = TaskService.getAllTasks();
        res.json({
            success: true,
            data: tasks,
            count: tasks.length
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }
        
        const task = TaskService.getTaskById(id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        
        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// POST /api/tasks - Create new task
router.post('/', (req, res) => {
    try {
        const { title } = req.body;
        
        // Validation
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return res.status(400).json({
                success: false,
                error: 'Task title is required and must be a non-empty string'
            });
        }
        
        if (title.trim().length > 200) {
            return res.status(400).json({
                success: false,
                error: 'Task title must be less than 200 characters'
            });
        }
        
        const newTask = TaskService.createTask(title);
        
        res.status(201).json({
            success: true,
            data: newTask,
            message: 'Task created successfully'
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }
        
        const { title, completed } = req.body;
        const updates = {};
        
        // Validate and add updates
        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: 'Title must be a non-empty string'
                });
            }
            updates.title = title.trim();
        }
        
        if (completed !== undefined) {
            if (typeof completed !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    error: 'Completed must be a boolean value'
                });
            }
            updates.completed = completed;
        }
        
        const updatedTask = TaskService.updateTask(id, updates);
        
        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        
        res.json({
            success: true,
            data: updatedTask,
            message: 'Task updated successfully'
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid task ID'
            });
        }
        
        const success = TaskService.deleteTask(id);
        
        if (!success) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

module.exports = router;