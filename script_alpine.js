function trelloApp() {
            return {
                tasks: [],
                newTask: {
                    title: '',
                    description: '',
                    status: 'todo'
                },
                editTask: {},
                editingId: null,
                showForm: false,
                searchQuery: '',
                statusFilter: 'all',
                showDeleteModal: false,
                taskToDelete: null,

                init() {
                    const savedTasks = localStorage.getItem('trello_tasks');
                    if (savedTasks) {
                        this.tasks = JSON.parse(savedTasks);
                    } else {
                        this.tasks = [
                            {
                                id: 1,
                                title: 'Révisions maths',
                                description: 'Chapitres 3 et 4 pour le partiel',
                                status: 'todo'
                            },
                            {
                                id: 2,
                                title: 'Projet web',
                                description: 'Finir la maquette et commencer le code',
                                status: 'inprogress'
                            },
                            {
                                id: 3,
                                title: 'Acheter bouquin',
                                description: 'Le livre de SQL à la fnac',
                                status: 'todo'
                            }
                        ];
                    }
                },

                saveTasks() {
                    localStorage.setItem('trello_tasks', JSON.stringify(this.tasks));
                },

                addTask() {
                    if (this.newTask.title.trim() !== '') {
                        this.tasks.push({
                            id: Date.now(),
                            title: this.newTask.title,
                            description: this.newTask.description,
                            status: this.newTask.status
                        });
                        this.newTask = { title: '', description: '', status: 'todo' };
                        this.showForm = false;
                        this.saveTasks();
                    }
                },

                startEdit(task) {
                    this.editingId = task.id;
                    this.editTask = { ...task };
                },

                saveEdit() {
                    if (this.editTask.title.trim() !== '') {
                        const index = this.tasks.findIndex(t => t.id === this.editingId);
                        if (index !== -1) {
                            this.tasks[index] = { ...this.editTask };
                            this.saveTasks();
                        }
                    }
                    this.cancelEdit();
                },

                cancelEdit() {
                    this.editingId = null;
                    this.editTask = {};
                },

                changeStatus(id, newStatus) {
                    const task = this.tasks.find(t => t.id === id);
                    if (task) {
                        task.status = newStatus;
                        this.saveTasks();
                    }
                },

                confirmDelete(id) {
                    this.taskToDelete = id;
                    this.showDeleteModal = true;
                },

                deleteTask() {
                    this.tasks = this.tasks.filter(t => t.id !== this.taskToDelete);
                    this.saveTasks();
                    this.showDeleteModal = false;
                    this.taskToDelete = null;
                },

                countByStatus(status) {
                    return this.tasks.filter(t => t.status === status).length;
                },

                getStatusLabel(status) {
                    const labels = {
                        'todo': 'À faire',
                        'inprogress': 'En cours',
                        'done': 'Terminé'
                    };
                    return labels[status];
                },

                get filteredTasks() {
                    let filtered = this.tasks;
                    if (this.statusFilter !== 'all') {
                        filtered = filtered.filter(t => t.status === this.statusFilter);
                    }
                    if (this.searchQuery.trim() !== '') {
                        const query = this.searchQuery.toLowerCase();
                        filtered = filtered.filter(t => 
                            t.title.toLowerCase().includes(query) || 
                            (t.description && t.description.toLowerCase().includes(query))
                        );
                    }
                    return filtered;
                }
            }
        }