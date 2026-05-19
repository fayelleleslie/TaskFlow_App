const express = require('express');
const taskController = require('../Controllers/taskController');
const auth = require('../middleware/authMiddleware');
const { validateTask } = require('../middleware/validationMiddleware');

const router = express.Router();

// Protection globale : Toutes les routes nécessitent d'etre authentifiées
// Les routes ci-dessous passent par le middleware 'auth'
router.use(auth);

// GET /tasks : Récupération, Recherche et Filtrage
router.get('/', taskController.getTasks);

// GET /tasks/:id : Consultation du detail d'une tache
router.get('/:id', taskController.getTaskById);

// POST /tasks : Création avec validation serveur
router.post('/', validateTask, taskController.createTask);

// PUT /tasks/:id : Modification sécurisée avec validation
router.put('/:id', validateTask, taskController.updateTask);

//DELETE /tasks/:id : Suppression sécurisée
router.delete('/:id', taskController.deleteTask);

module.exports = router;
