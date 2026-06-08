const taskService = require('../Services/taskService');

exports.createTask = async (req, res) => {
    try {
        const newTask = await taskService.createTask(req.user.id, req.body);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la tache' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const result = await taskService.getTasks(req.user.id, req.query);
        res.status(200).json(result);
    } catch (error) {
        if (error && error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: 'Erreur lors de la récupération des taches' });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await taskService.getTaskById(req.user.id, req.params.id);
        res.status(200).json(task);
    } catch (error) {
        if (error && error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: 'Erreur lors de la récupération de la tache' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
        res.json(task);
    } catch (error) {
        if (error && error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: 'Erreur lors de la modification de la tache' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.user.id, req.params.id);
        res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        if (error && error.status) return res.status(error.status).json({ message: error.message });
        res.status(500).json({ message: 'Erreur lors de la suppression de la tache' });
    }
};
