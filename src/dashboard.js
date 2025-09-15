const checkboxes = document.querySelectorAll('.expense-checkbox');

checkboxes.forEach( function (checkbox) {
    checkbox.addEventListener('change', function () {
        const isChecked = checkbox.checked;

        const expenseItem = checkbox.closest('.expense-item');


        if (isChecked) {
            expenseItem.classList.add('paid');
        }

        else {
            expenseItem.classList.remove('paid');
        }

        updateCounter()

    })
})




const addExpenseBtn = document.getElementById('addExpenseBtn');
const modal = document.getElementById('addExpenseModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const expenseForm = document.getElementById('expenseForm');

// Otvoriť modal
addExpenseBtn.addEventListener('click', function () {
    modal.classList.add('active');
});

// Zatvoriť modal - krížik
closeModalBtn.addEventListener('click', function () {
    modal.classList.remove('active');
    expenseForm.reset(); // Vyčisti formulár
});

// Zatvoriť modal - Cancel tlačidlo
cancelModalBtn.addEventListener('click', function () {
    modal.classList.remove('active');
    expenseForm.reset();
});

// Zatvoriť modal - klik mimo modal
modal.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.classList.remove('active');
        expenseForm.reset();
    }
});

// Spracovanie formulára
expenseForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Zabráni odoslaniu formulára
    
    console.log('Form submitted!');
    
    // Získaj údaje z formulára
    const expenseName = document.getElementById('expenseNameInput').value;
    const expenseAmount = document.getElementById('expenseAmountInput').value;
    const expenseDueDate = document.getElementById('expenseDueDateInput').value;
    const expenseIcon = document.getElementById('expenseIconSelect').value;
    
    console.log('Form data:', { expenseName, expenseAmount, expenseDueDate, expenseIcon });
    
    // Vytvor nový expense
    const uniqueId = `expense-${Date.now()}`;
    const newExpenseHTML = `
        <div class="expense-item">
            <div class="expense-content">
                <input type="checkbox" class="expense-checkbox" id="${uniqueId}">
                <div class="expense-icon ${expenseIcon}">
                    <i class="fa-solid fa-${expenseIcon}"></i>
                </div>
                <div class="expense-details">
                    <h4>${expenseName}</h4>
                    <p>Due: ${expenseDueDate}</p>
                </div>
            </div>
            <div class="expense-actions">
                <div class="expense-amount">€${expenseAmount}</div>
                <button class="btn-delete" title="Delete expense">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Pridaj do stránky
    const expensesList = document.querySelector('.expenses-list');
    expensesList.insertAdjacentHTML('beforeend', newExpenseHTML);
    
    // Pridaj funkčnosť novému checkboxu
    const newCheckbox = document.getElementById(uniqueId);
    newCheckbox.addEventListener('change', function () {
        const isChecked = newCheckbox.checked;
        const expenseItem = newCheckbox.closest('.expense-item');

        if (isChecked) {
            expenseItem.classList.add('paid');
        } else {
            expenseItem.classList.remove('paid');
        }

        updateCounter();
    });
    
    // Aktualizuj counter a zatvor modal
    updateCounter();
    modal.classList.remove('active');
    expenseForm.reset();
    
    console.log('New expense added successfully!');
});






const expensesList = document.querySelector('.expenses-list');

expensesList.addEventListener('click', function(event) {
    console.log('Niekto klikol v expenses-list!');
    console.log('Klikol na:', event.target);
    
    // KROK 1: Je to delete tlačidlo?
    const isDeleteButton = event.target.classList.contains('btn-delete');
    
    // KROK 2: Alebo klikol na ikonu v delete tlačidle?
    const isDeleteIcon = event.target.closest('.btn-delete');
    
    console.log('Je to delete tlačidlo?', isDeleteButton);
    console.log('Je to ikona v delete tlačidle?', isDeleteIcon);
    
    // KROK 3: Ak áno, zmaž expense
    if (isDeleteButton || isDeleteIcon) {
        console.log('🗑️ Mazanie expense!');
        
        // KROK 4: Nájdi celý expense-item
        const expenseItem = event.target.closest('.expense-item');
        console.log('Mazaný expense:', expenseItem);
        
        // KROK 5: Zmaž ho!
        expenseItem.remove();
        
        // KROK 6: Aktualizuj counter
        updateCounter();
        
        console.log('✅ Expense zmazaný!');
    }
});







function updateCounter () {
    const counter = document.querySelector('.expenses-counter');
    const howManyCheckboxes = document.querySelectorAll('.expense-checkbox');
    const howManyCheckboxesChecked = document.querySelectorAll('.expense-checkbox:checked');
    counter.innerHTML = `${howManyCheckboxesChecked.length} of ${howManyCheckboxes.length} paid`;
}

const deleteButtons = document.querySelectorAll('.btn-delete');

deleteButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        console.log('Delete clicked!');
        // mazanie...
    });
});


