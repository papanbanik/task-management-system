const TodoModel = require("../Models/Todo");

function handleError(res, error) {
  if (error.name === "validationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  res.status(500).json({ message: error.message });
}

// CREATE
exports.addTodo = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    const result = await TodoModel.create({
      title,
      description,
      status,
      priority,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL
exports.getTodos = async (req, res) => {
  try {
    const result = await TodoModel.find().sort({ createdAt: -1 });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET BY ID
exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await TodoModel.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const result = await TodoModel.findByIdAndUpdate(
      id,
      { title, description, status, priority },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    await TodoModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
