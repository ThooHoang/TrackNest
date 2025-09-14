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


function updateCounter () {
    const counter = document.querySelector('.expenses-counter');
    const howManyCheckboxes = checkboxes.length;
    const howManyCheckboxesChecked = document.querySelectorAll('.expense-checkbox:checked').length;
    counter.innerHTML = `${howManyCheckboxesChecked} of ${howManyCheckboxes} paid`;
}