const Task = require('../models/Tasks');

const normalizeTaskPayload = (payload) => ({
    ...payload,
    dueDate: payload.dueDate || undefined,
    reminderAt: payload.reminderAt || undefined
});

// CREATE : Ajouter une tâche
exports.createTask = async (req, res) => {
    try {
        // On ajoute l'ID de l'utilisateur (venant du middleware d'auth) à la tâche
        const newTask = new Task({ ...normalizeTaskPayload(req.body),
            // Liaison automatique au user connecté
            user: req.user.id });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création" });
    }
};

// READ : Récupérer les tâches avec FILTRAGE, RECHERCHE et sécurité
exports.getTasks = async (req, res) => {
    try {
        const { status, search } = req.query;

         // On ne récupère que les tâches de l'utilisateur connecté(sécurité)
        let query = { user: req.user.id };

        // FILTRAGE par statut
        if (status && status !== 'all') {
            query.status = status;
        }

        // RECHERCHE par mot-clé (insensible à la casse) dans le titre
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des taches" });
    }
};

// READ : Récupérer une seule tâche
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération de la tâche" });
    }
};

// UPDATE : Modifier une tâche
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
             // Sécurité : doit appartenir à l'user
            { _id: req.params.id, user: req.user.id },
            normalizeTaskPayload(req.body),
            { new: true }
        );
        if (!task) return res.status(404).json({ message: "Tâche non trouvée" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la modification" });
    }
};

// DELETE : Supprimer une tâche
exports.deleteTask = async (req, res) => {
    try {
        //On vérifie l'ID et l'appartenance à l'user
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!task) return res.status(404).json({ message: "Tâche introuvable" });
        res.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
};
