// =================================================================
// 1. DEKLARASI GLOBAL & ELEMEN DOM
// =================================================================

let todos = [];
const todoList = document.getElementById('todo-list');

// Elemen pesan kosong yang akan dibuat di JavaScript
const emptyMessage = document.createElement('p');
emptyMessage.id = 'empty-message';
emptyMessage.className = 'text-center text-gray-400 py-4';
emptyMessage.textContent = 'No task found';

// =================================================================
// 2. FUNGSI PENYIMPANAN DATA (LOCAL STORAGE)
// =================================================================

// Menyimpan array 'todos' ke Local Storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Memuat To-Do dari Local Storage saat aplikasi dimuat
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
    renderTodos();
}

// =================================================================
// 3. FUNGSI UTAMA: RENDER TODOS
// =================================================================

function renderTodos(filteredTodos = todos) {
    todoList.innerHTML = ''; // Selalu kosongkan list yang ada sebelum me-render

    // Logika 1: Menampilkan pesan jika tidak ada To-Do sama sekali
    if (filteredTodos.length === 0 && todos.length === 0) {
        todoList.appendChild(emptyMessage);
        return;
    }
    
    // Logika 2: Menampilkan pesan jika daftar kosong karena filter aktif
    if (filteredTodos.length === 0 && todos.length > 0) {
        const filterMessage = document.createElement('p');
        filterMessage.className = 'text-center text-gray-400 py-4';
        filterMessage.textContent = 'No todos match the filter criteria.';
        todoList.appendChild(filterMessage);
        return;
    }

    // Render setiap item To-Do ke DOM
    filteredTodos.forEach((todo, index) => {
        const listItem = document.createElement('li');
        // Menggunakan properti 'task' (sesuai perbaikan terakhir)
        listItem.className = `grid grid-cols-4 gap-4 items-center bg-gray-700 p-3 rounded-md transition-all duration-300 ${todo.completed ? 'opacity-50' : 'hover:bg-gray-600'}`;
        
        listItem.innerHTML = `
            <span class="truncate ${todo.completed ? 'line-through text-gray-500' : 'text-white'}">${todo.task}</span>
            
            <span class="text-xs text-gray-400">${todo.date}</span>
            
            <span class="text-xs font-medium ${todo.completed ? 'text-green-400' : 'text-yellow-400'}">
                ${todo.completed ? 'Completed' : 'Active'}
            </span>

            <div class="flex items-center space-x-2 justify-end">
                <input 
                    type="checkbox" 
                    class="h-4 w-4 text-green-500 bg-gray-600 border-gray-500 rounded focus:ring-green-400" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="toggleComplete(${index})"
                >
                <button onclick="deleteTodo(${index})" class="text-red-500 hover:text-red-400 font-bold text-lg leading-none p-0">
                    &times;
                </button>
            </div>
        `;

        todoList.appendChild(listItem);
    });
}

// =================================================================
// 4. FUNGSI UTAMA: AddTodo
// =================================================================

// Dipanggil saat form di-submit
function AddTodo() { 
    // 1. Ambil elemen dan nilai input
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("todo-date");
    
    const text = todoInput.value.trim();
    const date = todoDate.value;

    // 2. Validasi input
    if (text === "" || date === "") {
        alert("Please enter both a task and a date.");
        return; // Hentikan jika validasi gagal
    }

    const newTodo = {
        task: text, 
        date: date,
        completed: false
    };

    // 4. Tambahkan, simpan, dan render
    todos.push(newTodo);
    saveTodos(); 
    renderTodos();

    // 5. Bersihkan input
    todoInput.value = '';
    todoDate.value = '';
}

// =================================================================
// 5. FUNGSI PENDUKUNG (ACTIONS)
// =================================================================

// Mengubah status selesai/belum selesai
function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// Menghapus item To-Do
function deleteTodo(index) {
    todos.splice(index, 1); 
    saveTodos();
    renderTodos();
}

// Menghapus semua item To-Do
function deleteAllTodo() { 
    if (confirm("Are you sure you want to delete all todos? This action cannot be undone.")) {
        todos = []; // Kosongkan array
        saveTodos();
        renderTodos();
    }
}

// =================================================================
// 🌟 FUNGSI FILTER BARU (Menggunakan Dropdown) 🌟
// =================================================================

// Menyaring daftar To-Do berdasarkan status
function filterTodo() { 
    
    const filterSelect = document.getElementById('filter-select');
    const filterOption = filterSelect.value; // Nilai pasti: 'all', 'active', atau 'completed'

    let filteredList = todos;
    
    if (filterOption === 'completed') {
        filteredList = todos.filter(todo => todo.completed === true);
    } else if (filterOption === 'active') {
        filteredList = todos.filter(todo => todo.completed === false);
    } else {
        
        filteredList = todos;
    }

    renderTodos(filteredList);
}

// =================================================================
// 6. EVENT LISTENERS (Inisialisasi)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Muat To-Do saat halaman pertama kali dimuat
    loadTodos();

    // 2. Kaitkan fungsi AddTodo dengan submit form
    document.getElementById('todo-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        AddTodo();
    });

    // 3. Kaitkan fungsi Delete All
    document.getElementById('delete-all-btn').addEventListener('click', deleteAllTodo);
});