let todoList = [];

window.onload = function() {
    let storedList = localStorage.getItem('todoList');
    if (storedList) {
        todoList = JSON.parse(storedList);
        displayItems();
    }
};

function addTodo() {
  let inputElement = document.querySelector('#todo-input');
  let dateElement = document.querySelector('#todo-date');
  let todoItem = inputElement.value.trim();
  let todoDate = dateElement.value;

  if (todoItem && todoDate) {
      todoList.push({ item: todoItem, dueDate: todoDate, completed: false });
      localStorage.setItem('todoList', JSON.stringify(todoList));

      inputElement.value = '';
      dateElement.value = '';
      displayItems();
  } else {
      // Use SweetAlert2 for the alert
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Please enter both the TODO item and its due date.',
          customClass: {
              container: 'swal-container',
              popup: 'swal-popup',
              header: 'swal-header',
              title: 'swal-title',
              closeButton: 'swal-close-button',
              content: 'swal-content',
              actions: 'swal-actions',
              confirmButton: 'swal-confirm-button',
          },
      });
  }
}

function deleteItem(index) {
    todoList.splice(index, 1);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    displayItems();
    Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        showConfirmButton: false,
        timer: 1500
    });
}

function editItem(index) {
    Swal.fire({
        icon: 'info',
        title: 'Edit TODO',
        html: `
            <input id="swal-todo-input" class="swal2-input" value="${todoList[index].item}" placeholder="TODO">
            <input id="swal-due-date" class="swal2-input" value="${todoList[index].dueDate}" type="date">
        `,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
            const newTodo = document.getElementById('swal-todo-input').value;
            const newDate = document.getElementById('swal-due-date').value;
            if (!newTodo || !newDate) {
                Swal.showValidationMessage('TODO and due date are required');
            }
            return { newTodo: newTodo, newDate: newDate };
        }
    }).then(result => {
        if (result.isConfirmed) {
            todoList[index].item = result.value.newTodo;
            todoList[index].dueDate = result.value.newDate;
            localStorage.setItem('todoList', JSON.stringify(todoList));
            displayItems();
            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}


function toggleCompleted(index) {
    todoList[index].completed = !todoList[index].completed;
    localStorage.setItem('todoList', JSON.stringify(todoList));
    displayItems();
}

function displayItems() {
    let incompleteContainer = document.getElementById('incomplete-container');
    let completedContainer = document.getElementById('completed-container');
    incompleteContainer.innerHTML = '';
    completedContainer.innerHTML = '';

    todoList.forEach((todo, index) => {
        let todoItemElement = document.createElement('div');
        todoItemElement.classList.add('todo-item');

        let checkboxElement = document.createElement('input');
        checkboxElement.setAttribute('type', 'checkbox');
        checkboxElement.setAttribute('id', 'checkbox')
        checkboxElement.checked = todo.completed;
        checkboxElement.addEventListener('change', () => toggleCompleted(index));

        let textElement = document.createElement('span');
        textElement.textContent = todo.item;
        if (todo.completed) {
            textElement.style.textDecoration = 'line-through';
        }

        let dueDateElement = document.createElement('span');
        dueDateElement.textContent = todo.dueDate;
        if (todo.completed) {
            dueDateElement.style.textDecoration = 'line-through';
        }

        let editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button'); 
        editButton.innerHTML = '<i class="fa fa-edit"></i> Edit';
        editButton.addEventListener('click', () => editItem(index));
        
        let deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button'); 
        deleteButton.innerHTML = '<i class="fa fa-trash"></i> Delete';
        deleteButton.addEventListener('click', () => deleteItem(index));
        
        todoItemElement.appendChild(checkboxElement);
        todoItemElement.appendChild(textElement);
        todoItemElement.appendChild(dueDateElement);
        todoItemElement.appendChild(editButton);
        todoItemElement.appendChild(deleteButton);

        if (todo.completed) {
            completedContainer.appendChild(todoItemElement);
        } else {
            incompleteContainer.appendChild(todoItemElement);
        }
    });
}
