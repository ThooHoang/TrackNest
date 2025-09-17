function updateCounter() {
    const counter = document.querySelector('.expenses-counter');
    const howManyCheckboxes = document.querySelectorAll('.expense-checkbox');
    const howManyCheckboxesChecked = document.querySelectorAll('.expense-checkbox:checked');
    counter.innerHTML = `${howManyCheckboxesChecked.length} of ${howManyCheckboxes.length} paid`;
}

const DEFAULT_BUDGET_TEMPLATE = {
    monthlyIncome: 28688, 
    categories: {
        housing: {percentage: 40, spent: 4388},
        food: {percentage: 20, spent: 0},
        transport: {percentage: 15, spent: 0},
        healthcare: {percentage: 5, spent: 0},
        entertainment: {percentage: 10, spent: 88},
        personal: {percentage: 5, spent: 0},
        savings: {percentage: 5, spent: 0},
    }
};

let budgetData = null;


function saveTransactionData(transactions) {
    try {
        localStorage.setItem('trackNestTransactions', JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving transaction data:', error);
        alert('Error saving transaction data. Please try again.');
    }
}

function loadTransactionData() {
    try {
        const saved = localStorage.getItem('trackNestTransactions');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error loading transaction data:', error);
        return [];
    }
}

function saveBudgetData() {
    try {
        localStorage.setItem('trackNestBudget', JSON.stringify(budgetData));
        console.log('Budget data saved successfully');
    } catch (error) {
        console.error('Error saving budget data:', error);
        alert('Error saving budget data. Please try again.');
    }
}

function loadBudgetData() {
    try {
        const saved = localStorage.getItem('trackNestBudget');
        if (saved) {
            console.log('Loading existing budget data from localStorage');
            return JSON.parse(saved);
        } else {
            console.log('No existing budget data found, using default template');
            return JSON.parse(JSON.stringify(DEFAULT_BUDGET_TEMPLATE));
        }
    } catch (error) {
        console.error('Error loading budget data:', error);
        return JSON.parse(JSON.stringify(DEFAULT_BUDGET_TEMPLATE));
    }
}

function initializeBudgetData() {
    budgetData = loadBudgetData();
    

    if (!budgetData.monthlyIncome || budgetData.monthlyIncome === 0) {
        promptForInitialIncome();
    } else {
        updateAllDisplays();
    }
}

function promptForInitialIncome() {
    const income = prompt('Welcome to TrackNest! 🎉\n\nTo get started, please enter your monthly income (DKK):');

    if (income && !isNaN(income) && income > 0) {
        budgetData.monthlyIncome = parseFloat(income);
        saveBudgetData();
        updateAllDisplays();
    } else {
        alert('Please enter a valid income amount to use TrackNest');
        promptForInitialIncome();
    }
}

function updateAllDisplays() {
    console.log('updateAllDisplays called');
    console.log('budgetData status:', budgetData ? 'exists' : 'null');
    
    if (budgetData) {
        console.log('Updating income display...');
        updateIncomeDisplay();
        
        console.log('Updating budget cards...');
        updateBudgetCards();
        
        console.log('Updating balance left...');
        updateBalanceLeft();
        
        console.log('All displays updated successfully');
    } else {
        console.error('budgetData is null, cannot update displays');
    }
}

function updateIncomeDisplay() {
    const incomeElements = document.querySelectorAll('.navbar-stat .stat-amount');
    const incomeElement = incomeElements[0];

    if (incomeElement && budgetData) {
        incomeElement.style.cursor = 'pointer';
        incomeElement.title = 'Click to edit your monthly income';

        incomeElement.textContent = `${budgetData.monthlyIncome.toLocaleString('da-DK', {
            style: 'currency',
            currency: 'DKK',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        if (!incomeElement.hasAttribute('data-clickable')) {
            incomeElement.addEventListener('click', editIncome);
            incomeElement.setAttribute('data-clickable', 'true');
        }
    }
}

function editIncome() {
    const newIncome = prompt('Edit your monthly income:', budgetData.monthlyIncome);
    if (newIncome && !isNaN(newIncome) && newIncome > 0) {
        budgetData.monthlyIncome = parseFloat(newIncome);
        saveBudgetData();
        updateAllDisplays();
    }
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        housing: 'Housing & Utilities',
        food: 'Food & Dining',
        transport: 'Transportation',
        healthcare: 'Healthcare',
        entertainment: 'Entertainment & Subscriptions',
        personal: 'Personal & Shopping',
        savings: 'Savings & Investing'
    };
    return categoryNames[category] || category;
}

function editCategoryPercentage(category) {
    const categoryData = budgetData.categories[category];
    const categoryName = getCategoryDisplayName(category);

    const newPercentage = prompt(
        `Edit percentage for ${categoryName}:\n\nCurrent: ${categoryData.percentage}%`, 
        categoryData.percentage
    );
    
    if (newPercentage && !isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= 100) {
        budgetData.categories[category].percentage = parseFloat(newPercentage);
        saveBudgetData();
        updateAllDisplays();
    } else if (newPercentage !== null) {
        alert('Please enter a valid percentage between 0 and 100');
    }
}

function updateBudgetCards() {
    console.log('Updating budget cards...');
    console.log('Current budgetData:', budgetData);
    
    const budgetCards = document.querySelectorAll('.budget-card');
    console.log(`Found ${budgetCards.length} budget cards`);

    budgetCards.forEach(card => {
        const category = card.dataset.category;
        const categoryData = budgetData.categories[category];
        
        console.log(`Processing card for category: ${category}`, categoryData);

        if (categoryData) {
            const budgetAmount = (budgetData.monthlyIncome * categoryData.percentage) / 100;
            const spentAmount = categoryData.spent;
            const remainingAmount = budgetAmount - spentAmount;
            const progressPercentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;

            console.log(`${category}: Budget: ${budgetAmount}, Spent: ${spentAmount}, Remaining: ${remainingAmount}, Progress: ${progressPercentage}%`);


            const budgetAmountElement = card.querySelector('.budget-amount');
            const spentAmountElement = card.querySelector('.spent-amount');
            const remainingAmountElement = card.querySelector('.remaining-amount');
            const progressFillElement = card.querySelector('.progress-fill');
            const cardPercentageElement = card.querySelector('.card-percentage');

            if (budgetAmountElement) {
                budgetAmountElement.textContent = `${Math.round(budgetAmount).toLocaleString('da-DK')} kr.`;
                console.log(`Updated budget amount for ${category}: ${budgetAmountElement.textContent}`);
            }
            if (spentAmountElement) {
                spentAmountElement.textContent = `${Math.round(spentAmount).toLocaleString('da-DK')} kr.`;
                console.log(`Updated spent amount for ${category}: ${spentAmountElement.textContent}`);
            }
            if (remainingAmountElement) {
                remainingAmountElement.textContent = `${Math.round(remainingAmount).toLocaleString('da-DK')} kr.`;
                console.log(`Updated remaining amount for ${category}: ${remainingAmountElement.textContent}`);
            }
            if (progressFillElement) {
                progressFillElement.style.width = `${Math.min(progressPercentage, 100)}%`;
                console.log(`Updated progress for ${category}: ${progressFillElement.style.width}`);
            }
            if (cardPercentageElement) {
                cardPercentageElement.textContent = `${categoryData.percentage}%`;
            }

            if (cardPercentageElement) {
                cardPercentageElement.style.cursor = "pointer";
                cardPercentageElement.title = 'Click to edit percentage';

                if (!cardPercentageElement.hasAttribute('data-clickable')) {
                    cardPercentageElement.addEventListener('click', () => editCategoryPercentage(category));
                    cardPercentageElement.setAttribute('data-clickable', 'true');
                }
            }
            
            if (remainingAmountElement) {
                if (remainingAmount < 0) {
                    remainingAmountElement.style.color = '#e74c3c'; 
                } else {
                    remainingAmountElement.style.color = '#2ecc71'; 
                }
            }
        } else {
            console.error(`No category data found for: ${category}`);
        }
    });
    
    console.log('Budget cards update complete');
}

function updateBalanceLeft() {
    let totalSpent = 0;
    Object.values(budgetData.categories).forEach(category => {
        totalSpent += category.spent;
    });

    const balanceLeft = budgetData.monthlyIncome - totalSpent;
    const incomeElements = document.querySelectorAll('.navbar-stat .stat-amount');
    const balanceElement = incomeElements[1];

    if (balanceElement) {
        balanceElement.textContent = `${balanceLeft.toLocaleString('da-DK', {
            style: 'currency',
            currency: 'DKK',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;

        if (balanceLeft < 0) {
            balanceElement.style.color = '#e74c3c'; 
        } else if (balanceLeft < 200) {
            balanceElement.style.color = '#f39c12'; 
        } else {
            balanceElement.style.color = '#2ecc71'; 
        }
    }
}

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

const addExpenseBtn = document.getElementById('addExpenseBtn');
const modal = document.getElementById('addExpenseModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelModalBtn = document.getElementById('cancelModal');
const expenseForm = document.getElementById('expenseForm');


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
                <div class="expense-amount">${parseFloat(expenseAmount).toLocaleString('da-DK')} kr.</div>
                <button class="btn-delete" title="Delete expense">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    

    const expensesList = document.querySelector('.expenses-list');
    expensesList.insertAdjacentHTML('beforeend', newExpenseHTML);
    

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
    

    updateCounter();
    modal.classList.remove('active');
    expenseForm.reset();
});


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




const addTransactionBtn = document.getElementById('addTransactionBtn');
const addTransactionModal = document.getElementById('addIncomeExpenseModal');
const closeIncomeExpenseBtn = document.getElementById('closeIncomeExpenseModal');
const cancelIncomeExpenseBtn = document.getElementById('cancelIncomeExpenseModal');
const transactionForm = document.getElementById('transactionForm');


addTransactionBtn.addEventListener('click', function () {
    console.log('Add transaction button clicked');
    addTransactionModal.classList.add('active');
});

closeIncomeExpenseBtn.addEventListener('click', function () {
    addTransactionModal.classList.remove('active');
    transactionForm.reset();
});

cancelIncomeExpenseBtn.addEventListener('click', function () {
    addTransactionModal.classList.remove('active');
    transactionForm.reset();
});

addTransactionModal.addEventListener('click', function (event) {
    if (event.target === addTransactionModal) {
        addTransactionModal.classList.remove('active');
        transactionForm.reset();
    }
});


transactionForm.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Transaction form submitted');

    const transactionNameInput = document.getElementById('transactionNameInput').value;
    const transactionAmountInput = document.getElementById('transactionAmountInput').value;
    const transactionIncomeExpenseOption = document.getElementById('incomeOrExpense').value;
    const transactionIconSelect = document.getElementById('transactionIconSelect').value;
    const transactionCategorySelect = document.getElementById('transactionCategorySelect').value;

    console.log('Form data:', {
        name: transactionNameInput,
        amount: transactionAmountInput,
        type: transactionIncomeExpenseOption,
        icon: transactionIconSelect,
        category: transactionCategorySelect
    });

    const newTransaction = {
        name: transactionNameInput,
        amount: parseFloat(transactionAmountInput),
        type: transactionIncomeExpenseOption,
        icon: transactionIconSelect,
        category: transactionCategorySelect,
        id: Date.now()
    };


    const transactions = loadTransactionData();
    transactions.unshift(newTransaction);
    saveTransactionData(transactions);
    console.log('Transaction saved to localStorage');

    if (budgetData && budgetData.categories) {
        if (transactionIncomeExpenseOption === 'expense') {
            if (budgetData.categories[transactionCategorySelect]) {
                budgetData.categories[transactionCategorySelect].spent += parseFloat(transactionAmountInput);
                console.log(`Updated ${transactionCategorySelect} spent: ${budgetData.categories[transactionCategorySelect].spent}`);
            } else {
                console.error(`Category ${transactionCategorySelect} not found in budget data`);
            }
        } else if (transactionIncomeExpenseOption === 'income') {
            budgetData.monthlyIncome += parseFloat(transactionAmountInput);
            console.log(`Updated monthly income: ${budgetData.monthlyIncome}`);
        }

        saveBudgetData();
        console.log('Budget data saved, updating displays...');
        updateAllDisplays();
        console.log('Displays updated');
    } else {
        console.error('budgetData is null or categories missing');
    }

    const formattedAmount = parseFloat(transactionAmountInput).toLocaleString('da-DK');
    const newTransactionHTML = `
        <div class="transaction-item ${transactionIncomeExpenseOption}" data-transaction-id="${newTransaction.id}">
            <div class="transaction-content">
                <div class="transaction-icon ${transactionIconSelect}">
                    <i class="fa-solid fa-${transactionIconSelect}"></i>
                </div>
                <div class="transaction-details">
                    <h4>${transactionNameInput}</h4>
                </div>
            </div>
            <div class="transaction-amount ${transactionIncomeExpenseOption}">
                ${transactionIncomeExpenseOption === 'income' ? '+' : '-'}${formattedAmount} kr.
                <button class="btn-delete" title="Delete transaction">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    const transactionList = document.querySelector('.transactions-list');
    transactionList.insertAdjacentHTML('afterbegin', newTransactionHTML);
    console.log('Transaction added to UI');

    addTransactionModal.classList.remove('active');
    transactionForm.reset();
});

function displaySavedTransactions() {
    console.log('Loading saved transactions...');
    const transactions = loadTransactionData();
    console.log('Loaded transactions:', transactions);
    
    const transactionList = document.querySelector('.transactions-list');
    
    if (!transactionList) {
        console.error('Transaction list element not found');
        return;
    }
    
    transactionList.innerHTML = "";
    
    transactions.forEach(transaction => {
        const formattedAmount = parseFloat(transaction.amount).toLocaleString('da-DK');
        const transactionHTML = `
            <div class="transaction-item ${transaction.type}" data-transaction-id="${transaction.id || Date.now()}">
                <div class="transaction-content">
                    <div class="transaction-icon ${transaction.icon}">
                        <i class="fa-solid fa-${transaction.icon}"></i>
                    </div>
                    <div class="transaction-details">
                        <h4>${transaction.name}</h4>
                    </div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${formattedAmount} kr.
                    <button class="btn-delete" title="Delete transaction">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        transactionList.insertAdjacentHTML('beforeend', transactionHTML);
    });
    
    console.log(`Displayed ${transactions.length} transactions`);
}

const transactionList = document.querySelector('.transactions-list');

transactionList.addEventListener('click', function(event) {
    const deleteBtn = event.target.classList.contains('btn-delete');
    const deleteIcon = event.target.closest('.btn-delete');

    if (deleteBtn || deleteIcon) {
        const deleteItem = event.target.closest('.transaction-item');
        const transactionId = deleteItem.dataset.transactionId;
        
        console.log('Deleting transaction with ID:', transactionId);
        
        let transactions = loadTransactionData();
        const transactionToDelete = transactions.find(tx => tx.id == transactionId);
        
        // Update budget based on transaction type
        if (transactionToDelete && budgetData && budgetData.categories) {
            if (transactionToDelete.type === 'expense' && transactionToDelete.category) {
                if (budgetData.categories[transactionToDelete.category]) {
                    budgetData.categories[transactionToDelete.category].spent -= parseFloat(transactionToDelete.amount);
                    if (budgetData.categories[transactionToDelete.category].spent < 0) {
                        budgetData.categories[transactionToDelete.category].spent = 0;
                    }
                    console.log('Budget updated after expense deletion');
                }
            } else if (transactionToDelete.type === 'income') {
                budgetData.monthlyIncome -= parseFloat(transactionToDelete.amount);
                if (budgetData.monthlyIncome < 0) {
                    budgetData.monthlyIncome = 0;
                }
                console.log('Income removed from monthly budget');
            }
            
            saveBudgetData();
            updateAllDisplays();
        }
        
    
        transactions = transactions.filter(tx => tx.id != transactionId);
        saveTransactionData(transactions);
        

        deleteItem.remove();
        console.log('Transaction deleted successfully');
    }
});



document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    

    initializeBudgetData();
    debugBudgetState();
    setTimeout(() => {
        displaySavedTransactions();
        console.log('Initialization complete');
    }, 100);
});

function debugBudgetState() {
    console.log('=== BUDGET DEBUG STATE ===');
    console.log('budgetData:', budgetData);
    console.log('localStorage budget:', localStorage.getItem('trackNestBudget'));
    console.log('localStorage transactions:', localStorage.getItem('trackNestTransactions'));
    console.log('=== END DEBUG ===');
}

