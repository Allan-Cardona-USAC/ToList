import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [task, setTask] = useState(''); // Estado para el texto de la tarea
  const [endDate, setEndDate] = useState(''); // Estado para la fecha de entrega
  const [tasks, setTasks] = useState([]); // Estado para la lista de tareas
  const [error, setError] = useState(''); // Estado para los mensajes de error

  // Función para agregar una tarea
  const handleAddTask = () => {
    if (!task.trim()) {
      setError('El campo de la tarea no puede estar vacío');
      return;
    }

    if (!endDate) {
      setError('Debe seleccionar una fecha de entrega');
      return;
    }

    // Crear nueva tarea con fecha de entrega seleccionada
    const newTask = {
      id: Date.now(),
      text: task,
      isCompleted: false,
      endDate: new Date(endDate), // Guardar fecha de entrega
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setEndDate('');
    setError('');
  };

  // Función para eliminar una tarea
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  // Función para marcar una tarea como completada
  const handleToggleComplete = (taskId) => {
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  };

  // Función para calcular el tiempo restante hasta la fecha de entrega
  const calculateTimeRemaining = (endDate) => {
    const now = new Date(); // Fecha actual
    const timeDiff = new Date(endDate) - now; // Diferencia en milisegundos

    if (timeDiff <= 0) return 'Tiempo finalizado';

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)); // Días restantes
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24); // Horas restantes
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60); // Minutos restantes

    if (days > 0) {
      return `${days}d ${hours}h restantes`; // Si faltan días, mostramos días y horas
    } else {
      return `${hours}h ${minutes}m restantes`; // Si solo faltan horas, mostramos horas y minutos
    }
  };

  // Función para asignar clases CSS según la urgencia de la tarea
  const getUrgencyClass = (endDate) => {
    const timeDiff = new Date(endDate) - new Date();
    if (timeDiff <= 0) return 'time-over'; // Tarea vencida
    if (timeDiff < 1 * 60 * 60 * 1000) return 'time-critical'; // Menos de 1 hora
    if (timeDiff < 6 * 60 * 60 * 1000) return 'time-warning'; // Menos de 6 horas
    return 'time-normal'; // Más de 6 horas
  };

  // Ordenar tareas por fecha de finalización
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks([...tasks].sort((a, b) => new Date(a.endDate) - new Date(b.endDate)));
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>
      <div className="input-container">
        {/* Campo para agregar la descripción de la tarea */}
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Escribe una nueva tarea..."
        />

        {/* Campo para seleccionar la fecha de entrega, debajo del campo de texto */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* Botón para agregar la tarea */}
        <button onClick={handleAddTask}>Agregar Tarea</button>
        {error && <p className="error">{error}</p>}
      </div>
      
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${getUrgencyClass(task.endDate)}`}>
            {/* Checkbox para marcar como completada */}
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => handleToggleComplete(task.id)}
            />

            {/* Texto de la tarea */}
            <span className={task.isCompleted ? 'completed' : ''}>{task.text}</span>

            {/* Tiempo restante hasta la fecha de entrega */}
            <span className="time-remaining">{calculateTimeRemaining(task.endDate)}</span>

            {/* Botón para eliminar la tarea */}
            <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
