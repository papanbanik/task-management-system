const express = require("express");
const router = express.Router();
const {
  addTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

router.post("/add", addTodo);
router.get("/get", getTodos);
router.get("/get/:id", getTodoById);
router.put("/update/:id", updateTodo);
router.delete("/delete/:id", deleteTodo);

module.exports = router;
