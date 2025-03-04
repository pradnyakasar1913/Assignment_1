const express = require("express");
const router = express.Router();

router.use(express.json());

const tasks = [
    {
        "id": 2,
        "title": "Create a new project",
        "description": "Create a new project using Magic",
        "completed": false,
        priority: "medium",
        createdAt: new Date()
    }
];

const logger2 = (req,res,next) =>{
    next();
  }


router.get("/", (req, res) => {
    let filteredTasks = [...tasks];
    if (req.query.completed !== undefined) {
        const isCompleted = req.query.completed === "true";
        filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
    }
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
     res.json(filteredTasks);
});


router.get("/:id",(req,res,next) =>{
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.send(tasks[id]);
})

router.get("/priority/:level", (req, res) => {
    const level = req.params.level.toLowerCase();
    const validPriorities = ["low", "medium", "high"];
     if (!validPriorities.includes(level)) {
        return res.status(400).json({ error: "Invalid priority level. Use low, medium, or high." });
    }
    const filteredTasks = tasks.filter(task => task.priority === level);
    res.json(filteredTasks);
});


router.post("/", [logger2], (req, res, next) => {
    const { title, description, completed,priority  } = req.body;
     if (!title || typeof title !== "string") {
        return res.status(400).json({ error: "Title is required and must be a string" });
    }
    if (!description || typeof description !== "string") {
        return res.status(400).json({ error: "Description is required and must be a string" });
    }
    if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean (true/false)" });
    }
    const validPriorities = ["low", "medium", "high"];
    if (!priority || !validPriorities.includes(priority.toLowerCase())) {
        return res.status(400).json({ error: "Priority must be one of: low, medium, high" });
    }
    const task = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title,
        description,
        completed
    };
    tasks.push(task); 
    res.status(201).json(task); 
});


router.put("/:id", logger2, (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    const { title, description, completed } = req.body;
    if (title && typeof title !== "string") {
        return res.status(400).json({ error: "Title must be a string" });
    }
    if (description && typeof description !== "string") {
        return res.status(400).json({ error: "Description must be a string" });
    }
    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed must be a boolean" });
    }
   if (title) task.title = title;
    if (description) task.description = description;
    if (typeof completed === "boolean") task.completed = completed;

    res.json(task);
});


router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(task => task.id === id);
     if (index === -1) {
        return res.status(404).json({ error: "Task not found" });
    }
    tasks.splice(index, 1);
    res.json({ message: "Task deleted successfully" });
});

module.exports = router;