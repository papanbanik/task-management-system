import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { BsFillTrashFill } from "react-icons/bs";
import { MdDragIndicator } from "react-icons/md";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";

const API = "http://localhost:3001";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in-progress", label: "In progress" },
  { key: "done", label: "Done" },
];

const PRIORITY_STYLES = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : "";

// card-এর চেহারা। handleProps থাকলে drag handle দেখায়
const CardBody = ({ todo, handleProps, onDelete, onStatusChange }) => (
  <div className="bg-white rounded-lg px-4 py-3 mb-3 shadow-sm">
    <div className="flex gap-2">
      {handleProps && (
        <button
          type="button"
          aria-label={`Drag ${todo.title}`}
          className="touch-none cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
          {...handleProps}
        >
          <MdDragIndicator size={20} />
        </button>
      )}

      <div className="min-w-0 flex-1">
        <div className="font-semibold text-gray-800 break-words">
          {todo.title}
        </div>
        <div className="text-sm text-gray-500 mt-1 break-words">
          {todo.description}
        </div>
      </div>

      {onDelete && (
        <button
          type="button"
          aria-label={`Delete ${todo.title}`}
          onClick={() => onDelete(todo._id)}
          className="text-red-500 shrink-0 mt-1 cursor-pointer"
        >
          <BsFillTrashFill />
        </button>
      )}
    </div>

    <div className="flex items-center justify-between gap-2 mt-3">
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          PRIORITY_STYLES[todo.priority] || PRIORITY_STYLES.medium
        }`}
      >
        {todo.priority || "medium"}
      </span>

      {onStatusChange && (
        <select
          value={todo.status || "todo"}
          onChange={(e) => onStatusChange(todo, e.target.value)}
          aria-label={`Change status of ${todo.title}`}
          className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-700 bg-white cursor-pointer"
        >
          {COLUMNS.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      )}
    </div>

    {todo.createdAt && (
      <p className="text-xs text-gray-400 mt-2">
        Added {formatDate(todo.createdAt)}
      </p>
    )}
  </div>
);

// টানা যায় এমন card
const DraggableCard = ({ todo, onDelete, onStatusChange }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: todo._id,
  });

  return (
    <div ref={setNodeRef} className={isDragging ? "opacity-40" : ""}>
      <CardBody
        todo={todo}
        handleProps={{ ...attributes, ...listeners }}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

// card ফেলার জায়গা (column)
const Column = ({ col, count, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-2 min-h-[160px] transition-colors ${
        isOver ? "bg-slate-700/60" : ""
      }`}
    >
      <div className="flex justify-between mb-3 px-1 text-white font-semibold">
        <h3>{col.label}</h3>
        <span className="text-slate-400">{count}</span>
      </div>
      {children}
    </div>
  );
};

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [activeId, setActiveId] = useState(null);

  // ৫px না টানলে drag শুরু হয় না, তাই সাধারণ click নষ্ট হয় না
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${API}/get`);
        setTodos(result.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API}/delete/${id}`);
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (todo, newStatus) => {
    const previous = todos;

    // আগে screen বদলাও, যাতে card সাথে সাথে সরে যায়
    setTodos((prev) =>
      prev.map((t) => (t._id === todo._id ? { ...t, status: newStatus } : t)),
    );

    try {
      await axios.put(`${API}/update/${todo._id}`, { status: newStatus });
    } catch (err) {
      console.log(err);
      setTodos(previous); // save না হলে আগের অবস্থায় ফিরিয়ে দাও
      alert("Couldn't move the task. Try again.");
    }
  };

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return; // কোনো column-এর বাইরে ফেললে কিছু হবে না

    const todo = todos.find((t) => t._id === active.id);
    if (!todo) return;

    const newStatus = over.id;
    if ((todo.status || "todo") !== newStatus) {
      handleStatusChange(todo, newStatus);
    }
  };

  const activeTodo = todos.find((t) => t._id === activeId);

  return (
    <>
      <Navbar />

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 md:px-20 py-6">
          {COLUMNS.map((col) => {
            const items = todos.filter((t) => (t.status || "todo") === col.key);

            return (
              <Column key={col.key} col={col} count={items.length}>
                {items.length === 0 && (
                  <p className="text-sm text-slate-400 px-1">No tasks</p>
                )}

                {items.map((todo) => (
                  <DraggableCard
                    key={todo._id}
                    todo={todo}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </Column>
            );
          })}
        </div>

        <DragOverlay>
          {activeTodo ? <CardBody todo={activeTodo} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default Home;
