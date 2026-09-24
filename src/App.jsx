import { useState, useRef, useEffect } from "react";
import { Check, Trash2, Plus, GraduationCap, User, Wallet, Minus, X } from "lucide-react";

// Importa aquí las imágenes de la mascota con transparencia (.png)
import birdPencil from "./assets/bird-pencil.png"; // Academic
import birdCoin from "./assets/bird-coin.png";     // Expenses
import birdBall from "./assets/bird-ball.png";     // Personal

const CATEGORIES = [
  { id: "Academic", label: "Academic", icon: GraduationCap, mascot: birdPencil },
  { id: "Personal", label: "Personal", icon: User, mascot: birdBall },
  { id: "Expenses", label: "Expenses", icon: Wallet, mascot: birdCoin },
];

const getCategory = (id) => CATEGORIES.find((cat) => cat.id === id);

const INITIAL_TASKS = [
  { id: 1, text: "Finalize Research Proposal", category: "Academic", done: true },
  { id: 2, text: "Prepare Client Meeting Slides", category: "Personal", done: false },
  { id: 3, text: "Pay Internet Bill - $65", category: "Expenses", done: false },
  { id: 4, text: "Read Ch. 4 (Design Trends)", category: "Academic", done: true },
];

const MOTIVATIONAL_QUOTES = [
  "El progreso no hace ruido, pero se nota en el cielo.",
  "Compila tus sueños, debuguea tus miedos.",
  "Un buen código vuela alto, una gran tarea lo sostiene.",
  "La ingeniería transforma la complejidad en elegancia.",
  "Vuela tan alto como tus líneas de código te lleven."
];

const ANIMATION_DURATION_MS = 1000;

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeCategory, setActiveCategory] = useState("Academic");
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  // ----- ESTADOS DE EDICIÓN (CRUD - UPDATE) -----
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState("");

  // Frase motivacional dinámica
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const [animationClass, setAnimationClass] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const animationTimeoutRef = useRef(null);

  const triggerMascotAnimation = (className) => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    setAnimationClass(className);
    setAnimationKey((prevKey) => prevKey + 1);

    animationTimeoutRef.current = setTimeout(() => {
      setAnimationClass(null);
    }, ANIMATION_DURATION_MS);
  };

  const filteredTasks = tasks.filter((task) => task.category === activeCategory);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.done).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const activeMascot = getCategory(activeCategory).mascot;

  const handleAddTask = () => {
    const trimmedText = newTaskText.trim();
    if (trimmedText === "") return;

    const newTask = {
      id: Date.now(),
      text: trimmedText,
      category: activeCategory,
      done: false,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setNewTaskText("");
    setIsAdding(false);
    triggerMascotAnimation("animate-bounce");
  };

  // ----- FUNCIONES DE EDICIÓN (UPDATE) -----
  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = (id) => {
    const trimmed = editText.trim();
    if (trimmed !== "") {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, text: trimmed } : task
        )
      );
    }
    setEditingTaskId(null);
    setEditText("");
  };

  const handleToggleTask = (id) => {
    let willBeCompleted = false;
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id !== id) return task;
        willBeCompleted = !task.done;
        return { ...task, done: !task.done };
      })
    );
    if (willBeCompleted) triggerMascotAnimation("animate-spin");
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const countByCategory = (categoryId) =>
    tasks.filter((task) => task.category === categoryId).length;

  // Vista reducida (burbuja flotante)
  if (!isExpanded) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-purple-50 relative overflow-hidden">
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 w-20 h-20 rounded-full bg-white shadow-2xl border-2 border-purple-200 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
          title="Abrir TaskFlow"
        >
          <img src={activeMascot} alt="Abrir TaskFlow" className="w-full h-full object-cover" />
        </button>
      </div>
    );
  }

  // Vista completa con Dashboard y Widget
  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 to-purple-50 relative overflow-hidden flex items-center justify-start px-16">
      
      {/* Fondo con Frase Motivacional */}
      <div className="max-w-xl">
        <span className="text-xs font-bold tracking-widest text-purple-700 uppercase">TaskFlow Ecosystem</span>
        <h2 className="text-4xl font-extrabold text-slate-900 mt-2 transition-opacity duration-500 leading-tight">
          "{MOTIVATIONAL_QUOTES[quoteIndex]}"
        </h2>
        <p className="text-sm text-slate-500 mt-4">
          Organiza tus entregas, mantén el foco y deja que tu mascota celebre cada línea de progreso completada.
        </p>
      </div>

      {/* Widget Flotante Principal */}
      <div className="fixed bottom-6 right-6 w-[420px] h-[620px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-purple-100">
        
        {/* HEADER */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <img
              key={animationKey}
              src={activeMascot}
              alt={`Mascota de ${activeCategory}`}
              className={`w-28 h-28 object-contain shrink-0 ${animationClass || ""}`}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 leading-none">TaskFlow</h1>
                  <span className="text-xs text-slate-400">
                    {completedTasks} / {totalTasks} completadas ({progressPercent}%)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                    title="Minimizar"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-slate-500 transition-colors"
                    title="Cerrar"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#820AD1] to-fuchsia-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Filtros de Categoría */}
          <div className="flex gap-2">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const isActive = activeCategory === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border transition-colors ${
                    isActive
                      ? "bg-[#820AD1] border-[#820AD1] text-white shadow-md shadow-purple-200"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-xs font-semibold leading-none">{label}</span>
                  <span className={`text-[10px] ${isActive ? "text-purple-100" : "text-slate-400"}`}>
                    {countByCategory(id)} Tasks
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* LISTA DE TAREAS */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {filteredTasks.length === 0 && (
            <p className="text-sm text-slate-400 text-center mt-10">
              No hay tareas en "{activeCategory}" todavía.
            </p>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl shadow-sm px-4 py-3 hover:border-purple-200 transition-colors"
            >
              <button
                onClick={() => handleToggleTask(task.id)}
                className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                  task.done
                    ? "bg-[#820AD1] border-[#820AD1]"
                    : "border-slate-300 hover:border-purple-400"
                }`}
              >
                {task.done && <Check size={14} className="text-white" />}
              </button>

              <div className="flex-1 min-w-0">
                {editingTaskId === task.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(task.id);
                      if (e.key === "Escape") setEditingTaskId(null);
                    }}
                    onBlur={() => handleSaveEdit(task.id)}
                    className="w-full text-sm px-2 py-1 rounded border border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                ) : (
                  <p
                    onDoubleClick={() => handleStartEdit(task)}
                    className={`text-sm font-medium truncate cursor-pointer select-none ${
                      task.done ? "text-slate-400 line-through" : "text-slate-800"
                    }`}
                    title="Doble clic para editar"
                  >
                    {task.text}
                  </p>
                )}
                <p className="text-xs text-slate-400">Tag: {task.category} <span className="text-[10px] text-purple-400 italic">(Doble clic para editar)</span></p>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* ZONA DE AGREGAR TAREA */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          {isAdding && (
            <input
              autoFocus
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
                if (e.key === "Escape") setIsAdding(false);
              }}
              onBlur={() => {
                if (newTaskText.trim() !== "") handleAddTask();
                else setIsAdding(false);
              }}
              placeholder={`Nueva tarea en ${activeCategory}...`}
              className="flex-1 text-sm px-4 py-2.5 rounded-full border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          )}

          <button
            onClick={() => setIsAdding(true)}
            className="shrink-0 w-12 h-12 rounded-full bg-[#820AD1] hover:bg-purple-800 text-white flex items-center justify-center shadow-lg shadow-purple-300 transition-colors"
          >
            <Plus size={22} />
          </button>
        </div>

      </div>
    </div>
  );
}