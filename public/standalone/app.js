// Data Storage
const STORAGE_KEY = 'taskTrackerData';

// Default Tasks
const defaultTasks = [
    {
        id: 'task-1',
        name: 'التمارين',
        icon: '💪',
        colors: [
            { id: 'done', name: 'منجز', hue: 142 },
            { id: 'partial', name: 'جزئي', hue: 38 },
            { id: 'missed', name: 'فائت', hue: 0 }
        ],
        gridData: {},
        createdAt: Date.now()
    },
    {
        id: 'task-2',
        name: 'الدراسة لمدة ٣٠ دقيقة',
        icon: '📚',
        colors: [
            { id: 'done', name: 'منجز', hue: 142 },
            { id: 'partial', name: 'جزئي', hue: 38 },
            { id: 'missed', name: 'فائت', hue: 0 }
        ],
        gridData: {},
        createdAt: Date.now()
    }
];

// Emoji options
const emojis = ['💪', '📚', '🏃', '🎯', '💼', '🎨', '🎵', '🧘', '💊', '🥗', '💧', '😴', '🚭', '💰', '📝', '🌱'];

// Month names in Arabic
const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

// State
let tasks = [];
let activeTaskId = null;
let selectedColorId = null;
let newColorHue = 200;
let selectedEmoji = '💪';
let editingTaskId = null;

// DOM Elements
const taskTabsEl = document.getElementById('taskTabs');
const mainContentEl = document.getElementById('mainContent');
const addTaskModal = document.getElementById('addTaskModal');
const editTaskModal = document.getElementById('editTaskModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const closeAddModal = document.getElementById('closeAddModal');
const closeEditModal = document.getElementById('closeEditModal');
const cancelAddTask = document.getElementById('cancelAddTask');
const confirmAddTask = document.getElementById('confirmAddTask');
const confirmEditTask = document.getElementById('confirmEditTask');
const deleteTaskBtn = document.getElementById('deleteTask');
const taskNameInput = document.getElementById('taskNameInput');
const editTaskNameInput = document.getElementById('editTaskNameInput');
const emojiPicker = document.getElementById('emojiPicker');
const editEmojiPicker = document.getElementById('editEmojiPicker');

// Initialize
function init() {
    loadData();
    renderEmojiPicker(emojiPicker, (emoji) => { selectedEmoji = emoji; });
    renderEmojiPicker(editEmojiPicker, (emoji) => { selectedEmoji = emoji; });
    setupEventListeners();
    render();
}

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        tasks = JSON.parse(saved);
    } else {
        tasks = defaultTasks;
        saveData();
    }
    if (tasks.length > 0) {
        activeTaskId = tasks[0].id;
        selectedColorId = tasks[0].colors[0]?.id || null;
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Setup event listeners
function setupEventListeners() {
    addTaskBtn.addEventListener('click', () => {
        taskNameInput.value = '';
        selectedEmoji = '💪';
        renderEmojiPicker(emojiPicker, (emoji) => { selectedEmoji = emoji; });
        addTaskModal.classList.add('show');
    });

    closeAddModal.addEventListener('click', () => addTaskModal.classList.remove('show'));
    cancelAddTask.addEventListener('click', () => addTaskModal.classList.remove('show'));
    closeEditModal.addEventListener('click', () => editTaskModal.classList.remove('show'));

    confirmAddTask.addEventListener('click', () => {
        const name = taskNameInput.value.trim();
        if (name) {
            addTask(name, selectedEmoji);
            addTaskModal.classList.remove('show');
        }
    });

    confirmEditTask.addEventListener('click', () => {
        const name = editTaskNameInput.value.trim();
        if (name && editingTaskId) {
            updateTask(editingTaskId, name, selectedEmoji);
            editTaskModal.classList.remove('show');
        }
    });

    deleteTaskBtn.addEventListener('click', () => {
        if (editingTaskId && confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
            deleteTask(editingTaskId);
            editTaskModal.classList.remove('show');
        }
    });

    // Close modals on overlay click
    addTaskModal.addEventListener('click', (e) => {
        if (e.target === addTaskModal) addTaskModal.classList.remove('show');
    });
    editTaskModal.addEventListener('click', (e) => {
        if (e.target === editTaskModal) editTaskModal.classList.remove('show');
    });
}

// Render emoji picker
function renderEmojiPicker(container, onSelect) {
    container.innerHTML = emojis.map(emoji => `
        <button class="emoji-btn ${emoji === selectedEmoji ? 'selected' : ''}" data-emoji="${emoji}">
            ${emoji}
        </button>
    `).join('');

    container.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            onSelect(btn.dataset.emoji);
        });
    });
}

// Add new task
function addTask(name, icon) {
    const newTask = {
        id: 'task-' + Date.now(),
        name,
        icon,
        colors: [
            { id: 'done', name: 'منجز', hue: 142 },
            { id: 'partial', name: 'جزئي', hue: 38 },
            { id: 'missed', name: 'فائت', hue: 0 }
        ],
        gridData: {},
        createdAt: Date.now()
    };
    tasks.push(newTask);
    activeTaskId = newTask.id;
    selectedColorId = newTask.colors[0].id;
    saveData();
    render();
}

// Update task
function updateTask(taskId, name, icon) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.name = name;
        task.icon = icon;
        saveData();
        render();
    }
}

// Delete task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    if (activeTaskId === taskId) {
        activeTaskId = tasks.length > 0 ? tasks[0].id : null;
    }
    saveData();
    render();
}

// Open edit modal
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        editingTaskId = taskId;
        editTaskNameInput.value = task.name;
        selectedEmoji = task.icon;
        renderEmojiPicker(editEmojiPicker, (emoji) => { selectedEmoji = emoji; });
        editTaskModal.classList.add('show');
    }
}

// Add color to task
function addColorToTask(taskId, name, hue) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const newColor = {
            id: 'color-' + Date.now(),
            name,
            hue
        };
        task.colors.push(newColor);
        saveData();
        render();
    }
}

// Remove color from task
function removeColorFromTask(taskId, colorId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.colors.length > 1) {
        task.colors = task.colors.filter(c => c.id !== colorId);
        // Remove cells with this color
        Object.keys(task.gridData).forEach(key => {
            if (task.gridData[key] === colorId) {
                delete task.gridData[key];
            }
        });
        if (selectedColorId === colorId) {
            selectedColorId = task.colors[0]?.id || null;
        }
        saveData();
        render();
    }
}

// Toggle cell color
function toggleCell(taskId, cellKey) {
    const task = tasks.find(t => t.id === taskId);
    if (task && selectedColorId) {
        if (task.gridData[cellKey] === selectedColorId) {
            delete task.gridData[cellKey];
        } else {
            task.gridData[cellKey] = selectedColorId;
        }
        saveData();
        render();
    }
}

// Get color by ID
function getColorById(task, colorId) {
    return task.colors.find(c => c.id === colorId);
}

// Calculate stats
function calculateStats(task) {
    const year = new Date().getFullYear();
    let totalDays = 0;
    let filledDays = 0;

    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (date <= new Date()) {
                totalDays++;
                const cellKey = `${year}-${month}-${day}`;
                if (task.gridData[cellKey]) {
                    filledDays++;
                }
            }
        }
    }

    const percentage = totalDays > 0 ? Math.round((filledDays / totalDays) * 100) : 0;
    return { totalDays, filledDays, percentage };
}

// Render everything
function render() {
    renderTabs();
    renderMainContent();
}

// Render tabs
function renderTabs() {
    taskTabsEl.innerHTML = tasks.map(task => `
        <button class="task-tab ${task.id === activeTaskId ? 'active' : ''}" data-task-id="${task.id}">
            <span>${task.icon}</span>
            <span>${task.name}</span>
            <button class="edit-btn" data-edit-id="${task.id}">✏️</button>
        </button>
    `).join('');

    taskTabsEl.querySelectorAll('.task-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            if (!e.target.classList.contains('edit-btn')) {
                activeTaskId = tab.dataset.taskId;
                const task = tasks.find(t => t.id === activeTaskId);
                if (task && task.colors.length > 0) {
                    selectedColorId = task.colors[0].id;
                }
                render();
            }
        });
    });

    taskTabsEl.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(btn.dataset.editId);
        });
    });
}

// Render main content
function renderMainContent() {
    if (!activeTaskId || tasks.length === 0) {
        mainContentEl.innerHTML = `
            <div class="empty-state">
                <h2>لا توجد مهام</h2>
                <p>أضف مهمة جديدة للبدء في متابعة تقدمك</p>
            </div>
        `;
        return;
    }

    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return;

    const stats = calculateStats(task);

    mainContentEl.innerHTML = `
        <div class="task-page">
            <aside class="sidebar">
                <!-- Stats -->
                <div class="stats-card">
                    <h3>الإحصائيات</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">${stats.filledDays}</div>
                            <div class="stat-label">أيام مكتملة</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.totalDays}</div>
                            <div class="stat-label">إجمالي الأيام</div>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${stats.percentage}%"></div>
                    </div>
                    <div class="stat-item" style="margin-top: 0.5rem;">
                        <div class="stat-value">${stats.percentage}%</div>
                        <div class="stat-label">نسبة الإنجاز</div>
                    </div>
                </div>

                <!-- Color Palette -->
                <div class="color-palette">
                    <h3>الألوان</h3>
                    <div class="colors-list">
                        ${task.colors.map(color => `
                            <div class="color-item ${color.id === selectedColorId ? 'selected' : ''}" data-color-id="${color.id}">
                                <div class="color-swatch" style="background: hsl(${color.hue}, 70%, 50%)"></div>
                                <span class="color-name">${color.name}</span>
                                ${task.colors.length > 1 ? `<button class="color-delete" data-delete-color="${color.id}">🗑️</button>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div class="add-color-form">
                        <input type="text" id="newColorName" placeholder="اسم اللون الجديد">
                        <div class="color-preview-row">
                            <div class="color-preview" id="colorPreview" style="background: hsl(${newColorHue}, 70%, 50%)"></div>
                            <input type="range" id="colorHueSlider" min="0" max="360" value="${newColorHue}">
                        </div>
                        <button class="add-color-btn" id="addColorBtn">إضافة لون</button>
                    </div>
                </div>
            </aside>

            <!-- Year Grid -->
            <div class="year-grid-container">
                <div class="year-grid">
                    ${renderYearGrid(task)}
                </div>
            </div>
        </div>
    `;

    // Color selection
    mainContentEl.querySelectorAll('.color-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('color-delete')) {
                selectedColorId = item.dataset.colorId;
                render();
            }
        });
    });

    // Color deletion
    mainContentEl.querySelectorAll('.color-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeColorFromTask(activeTaskId, btn.dataset.deleteColor);
        });
    });

    // Color hue slider
    const hueSlider = document.getElementById('colorHueSlider');
    const colorPreview = document.getElementById('colorPreview');
    if (hueSlider) {
        hueSlider.addEventListener('input', () => {
            newColorHue = parseInt(hueSlider.value);
            colorPreview.style.background = `hsl(${newColorHue}, 70%, 50%)`;
        });
    }

    // Add color button
    const addColorBtn = document.getElementById('addColorBtn');
    const newColorNameInput = document.getElementById('newColorName');
    if (addColorBtn) {
        addColorBtn.addEventListener('click', () => {
            const name = newColorNameInput.value.trim();
            if (name) {
                addColorToTask(activeTaskId, name, newColorHue);
                newColorNameInput.value = '';
            }
        });
    }

    // Cell clicks
    mainContentEl.querySelectorAll('.day-cell:not(.empty)').forEach(cell => {
        cell.addEventListener('click', () => {
            toggleCell(activeTaskId, cell.dataset.cellKey);
        });
    });
}

// Render year grid
function renderYearGrid(task) {
    const year = new Date().getFullYear();
    const today = new Date();

    let html = '<table class="grid-table"><thead><tr><th>اليوم</th>';
    
    // Month headers
    monthNames.forEach(month => {
        html += `<th>${month}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Days (1-31)
    for (let day = 1; day <= 31; day++) {
        html += `<tr><td>${day}</td>`;
        
        for (let month = 0; month < 12; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            if (day > daysInMonth) {
                html += '<td><div class="day-cell empty"></div></td>';
            } else {
                const cellKey = `${year}-${month}-${day}`;
                const colorId = task.gridData[cellKey];
                const color = colorId ? getColorById(task, colorId) : null;
                const bgColor = color ? `hsl(${color.hue}, 70%, 50%)` : '';
                
                const cellDate = new Date(year, month, day);
                const isToday = cellDate.toDateString() === today.toDateString();
                
                html += `<td>
                    <div class="day-cell ${isToday ? 'today' : ''}" 
                         data-cell-key="${cellKey}"
                         style="${bgColor ? `background: ${bgColor}` : ''}">
                    </div>
                </td>`;
            }
        }
        html += '</tr>';
    }

    html += '</tbody></table>';
    return html;
}

// Start the app
init();
