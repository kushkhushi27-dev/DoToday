// DoToday Client Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Auto-dismiss alerts after 4 seconds
    const alerts = document.querySelectorAll('.auto-dismiss-alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 4000);
    });

    // Quick fill demo accounts on login page
    const demoFillButtons = document.querySelectorAll('[data-demo-user]');
    demoFillButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const username = this.getAttribute('data-demo-user');
            const password = this.getAttribute('data-demo-pass');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (usernameInput && passwordInput) {
                usernameInput.value = username;
                passwordInput.value = password;
                // subtle highlight effect
                usernameInput.classList.add('ring-2', 'ring-sky-500');
                passwordInput.classList.add('ring-2', 'ring-sky-500');
                setTimeout(() => {
                    usernameInput.classList.remove('ring-2', 'ring-sky-500');
                    passwordInput.classList.remove('ring-2', 'ring-sky-500');
                }, 1000);
            }
        });
    });

    // Kanban drag and drop support
    const taskCards = document.querySelectorAll('.draggable-task');
    const dropZones = document.querySelectorAll('.kanban-dropzone');

    taskCards.forEach(card => {
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.taskId);
            this.classList.add('opacity-50');
        });

        card.addEventListener('dragend', function() {
            this.classList.remove('opacity-50');
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('bg-sky-50', 'border-sky-300');
        });

        zone.addEventListener('dragleave', function() {
            this.classList.remove('bg-sky-50', 'border-sky-300');
        });

        zone.addEventListener('drop', async function(e) {
            e.preventDefault();
            this.classList.remove('bg-sky-50', 'border-sky-300');
            const taskId = e.dataTransfer.getData('text/plain');
            const targetStatus = this.dataset.status;

            if (taskId && targetStatus) {
                try {
                    const response = await fetch(`/api/tasks/${taskId}/status`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ status: targetStatus })
                    });

                    if (response.ok) {
                        window.location.reload();
                    } else {
                        console.error('Failed to update status');
                    }
                } catch (err) {
                    console.error('Network error moving task', err);
                }
            }
        });
    });
});
