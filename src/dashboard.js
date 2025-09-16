// ============================================
// UTILITY FUNCTIONS
// ============================================

function updateCounter() {
    const counter = document.querySelector('.expenses-counter');
    const howManyCheckboxes = document.querySelectorAll('.expense-checkbox');
    const howManyCheckboxesChecked = document.querySelectorAll('.expense-checkbox:checked');
    counter.innerHTML = `${howManyCheckboxesChecked.length} of ${howManyCheckboxes.length} paid`;
}

// ============================================
// EXPENSE FUNCTIONALITY
// ============================================

// Initialize existing expense checkboxes
const checkboxes = document.querySelectorAll('.expense-checkbox');

checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        const isChecked = checkbox.checked;
        const expenseItem = checkbox.closest('.expense-item');

        if (isChecked) {
            expenseItem.classList.add('paid');
        } else {
            expenseItem.classList.remove('paid');
        }

        updateCounter();
    });
});

// Expense Modal Elements
const addExpenseBtn = document.getElementById('addExpenseBtn');
const modal = document.getElementById('addExpenseModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const expenseForm = document.getElementById('expenseForm');

// Expense Modal Event Listeners
addExpenseBtn.addEventListener('click', function () {
    modal.classList.add('active');
});

closeModalBtn.addEventListener('click', function () {
    modal.classList.remove('active');
    expenseForm.reset();
});

cancelModalBtn.addEventListener('click', function () {
    modal.classList.remove('active');
    expenseForm.reset();
});

modal.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.classList.remove('active');
        expenseForm.reset();
    }
});

// Expense Form Submission
expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Get form data
    const expenseName = document.getElementById('expenseNameInput').value;
    const expenseAmount = document.getElementById('expenseAmountInput').value;
    const expenseDueDate = document.getElementById('expenseDueDateInput').value;
    const expenseIcon = document.getElementById('expenseIconSelect').value;
    
    // Create new expense
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
    
    // Add to page
    const expensesList = document.querySelector('.expenses-list');
    expensesList.insertAdjacentHTML('beforeend', newExpenseHTML);
    
    // Add functionality to new checkbox
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
    
    // Update counter and close modal
    updateCounter();
    modal.classList.remove('active');
    expenseForm.reset();
});

// Expense Delete Functionality
const expensesList = document.querySelector('.expenses-list');

expensesList.addEventListener('click', function(event) {
    const isDeleteButton = event.target.classList.contains('btn-delete');
    const isDeleteIcon = event.target.closest('.btn-delete');
    
    if (isDeleteButton || isDeleteIcon) {
        const expenseItem = event.target.closest('.expense-item');
        expenseItem.remove();
        updateCounter();
    }
});

// ============================================
// TRANSACTION FUNCTIONALITY
// ============================================

// Transaction Modal Elements
const addTransactionBtn = document.getElementById('addTransactionBtn');
const addTransactionModal = document.getElementById('addIncomeExpenseModal');
const closeIncomeExpenseBtn = document.getElementById('closeIncomeExpenseModal');
const cancelIncomeExpenseBtn = document.getElementById('cancelIncomeExpenseModal');
const transactionForm = document.getElementById('transactionForm');

// Transaction Modal Event Listeners
addTransactionBtn.addEventListener('click', function () {
    addTransactionModal.classList.add('active');
});

closeIncomeExpenseBtn.addEventListener('click', function () {
    addTransactionModal.classList.remove('active');
});

cancelIncomeExpenseBtn.addEventListener('click', function () {
    addTransactionModal.classList.remove('active');
});

addTransactionModal.addEventListener('click', function (event) {
    if (event.target === addTransactionModal) {
        addTransactionModal.classList.remove('active');
    }
});

// Transaction Form Submission
transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    const transactionNameInput = document.getElementById('transactionNameInput').value;
    const transactionAmountInput = document.getElementById('transactionAmountInput').value;
    const transactionIncomeExpenseOption = document.getElementById('incomeOrExpense').value;
    const transactionIconSelect = document.getElementById('transactionIconSelect').value;

    // Create new transaction
    const newTransactionHTML = `
        <div class="transaction-item ${transactionIncomeExpenseOption}">
            <div class="transaction-content">
                <div class="transaction-icon ${transactionIconSelect}">
                    <i class="fa-solid fa-${transactionIconSelect}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transactionNameInput}</h4>
                </div>
            </div>
            <div class="transaction-amount ${transactionIncomeExpenseOption}">
                ${transactionIncomeExpenseOption === 'income' ? '+' : '-'}€${transactionAmountInput}
                <button class="btn-delete" title="Delete transaction">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add to page (newest first)
    const transactionList = document.querySelector('.transactions-list');
    transactionList.insertAdjacentHTML('afterbegin', newTransactionHTML);

    // Close modal and reset form
    addTransactionModal.classList.remove('active');
    transactionForm.reset();
});

// Transaction Delete Functionality
const transactionList = document.querySelector('.transactions-list');

transactionList.addEventListener('click', function(event) {
    const deleteBtn = event.target.classList.contains('btn-delete');
    const deleteIcon = event.target.closest('.btn-delete');

    if (deleteBtn || deleteIcon) {
        const deleteItem = event.target.closest('.transaction-item');
        deleteItem.remove();
    }
});



// Buddget System

const DEFAULT_BUDGET_TEMPLATE = {
    monthlyIncome: 0,
    categories: {
        housing: {percentage:40, spent:0},
        food: {percentage:20, spent:0},
        transport: {percentage:15, spent:0},
        healthcare: {percentage:5, spent:0},
        entertainment: {percentage:10, spent:0},
        personal: {percentage:5, spent:0},
        savings: {percentage:5, spent:0},
    }
}

let budgetData = null;


// Load Budget Data Local Storage

function initializeBudgetData () {
    const savedData = localStorage.getItem('trackNestBudget');

    if (savedData) {
        budgetData = JSON.parse(savedData);
        updateAllDisplays();
    } else {
        budgetData = JSON.parse(JSON.stringify(DEFAULT_BUDGET_TEMPLATE));
         promptForInitialIncome();
    }
}


// Save Data to Local Storage

function saveBudgetData () {
    localStorage.setItem('trackNestBudget', JSON.stringify(budgetData))
}

function promptForInitialIncome () {
    const income = prompt('Welcome to TrackNest! 🎉\n\nTo get started, please enter your monthly income (€):')

    if (income && !isNaN(income) && income >0) {
        budgetData.monthlyIncome = parseFloat(income);
        saveBudgetData();
        updateAllDisplays();

    } else {
        alert('Please enter valid income amount to use TrackNest');
        promptForInitialIncome()
    }
}


document.addEventListener('DOMContentLoaded', function() {
    initializeBudgetData();
})


function updateAllDisplays () {
    updateIncomeDisplay();
    updateBudgetCards();
    updateBalanceLeft();
}

function updateIncomeDisplay() {

    const incomeElements = document.querySelectorAll('.navbar-stat .stat-amount');
    const incomeElement = incomeElements[0];

    incomeElement.style.cursor = 'pointer';
    incomeElement.title= 'Click to edit your monthly income'

     incomeElement.textContent = `${budgetData.monthlyIncome.toLocaleString('da-DK', {
        style: 'currency',
        currency: 'DKK',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

    if (!incomeElement.hasAttribute('data-clickable')) {
        incomeElement.addEventListener('click', editIncome);
        incomeElement.setAttribute('data-clickable', 'true')
    }


}


function editIncome() {
    const newIncome = prompt('Edit your monthly income:', budgetData.monthlyIncome);
    budgetData.monthlyIncome = parseFloat(newIncome);
    saveBudgetData();
    updateAllDisplays();
}


function updateBudgetCards () {
    const budgetCards = document.querySelectorAll('.budget-card');

    budgetCards.forEach(card => {
        const category = card.dataset.category;
        const categoryData = budgetData.categories[category];

        if (categoryData) {
            const budgetAmount = (budgetData.monthlyIncome * categoryData.percentage) / 100;
            const spentAmount = categoryData.spent;
            const remainingAmount = budgetAmount - spentAmount;
            const progressPercentage = budgetAmount > 0 ? (spentAmount/budgetAmount) * 100 : 0;

            // Changed from € to DKK formatting
            card.querySelector('.budget-amount').textContent = `${Math.round(budgetAmount).toLocaleString('da-DK')} kr.`;
            card.querySelector('.spent-amount').textContent = `${Math.round(spentAmount).toLocaleString('da-DK')} kr.`;
            card.querySelector('.remaining-amount').textContent = `${Math.round(remainingAmount).toLocaleString('da-DK')} kr.`;
            card.querySelector('.progress-fill').style.width = `${Math.min(progressPercentage, 100)}%`;

            const remainingElement = card.querySelector('.remaining-amount');
            if (remainingAmount < 0) {
                remainingElement.style.color = '#e74c3c'; // Red
            } else {
                remainingElement.style.color = '#2ecc71'; // Green
            }
        }
    })
}


function updateBalanceLeft () {
    let totalSpent = 0 ;
    Object.values(budgetData.categories).forEach(category => {
        totalSpent+=category.spent;
    })

    const balanceLeft = budgetData.monthlyIncome - totalSpent;
    const incomeElements = document.querySelectorAll('.navbar-stat .stat-amount');
    const balanceElement = incomeElements[1];

    balanceElement.textContent = `${balanceLeft.toLocaleString('da-DK', {
        style: 'currency',
        currency: 'DKK',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

    if (balanceLeft < 0) {
        balanceElement.style.color = '#e74c3c'; // Red - overspending!
    } else if (balanceLeft < 200) {
        balanceElement.style.color = '#f39c12'; // Orange - low balance
    } else {
        balanceElement.style.color = '#2ecc71'; // Green - healthy balance
    }
}


