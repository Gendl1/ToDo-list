import './styles/_variables.scss'
import './styles/main.scss'

// Filter vars
const filterBlock  = document.querySelector('.hero__search-filter');
const filterName   = document.querySelector('.hero__search-filter-name');
const choiceList   = document.querySelector('.hero__search-filter-choice');
const choiceItems  = document.querySelectorAll('.hero__search-filter-choice-text');

//Add Notes button vars
const modal = document.querySelector('.notes__modal');
const modalshow = document.querySelector('.notes__add-button');
const modalcancel = document.querySelector('.notes__modal-buttons-cancel');
const modalapply = document.querySelector('.notes__modal-buttons-apply');
const modalbg = document.querySelector('.notes__modal-bg');
const html = document.querySelector('.html');

//Modal show
modalshow.addEventListener('click', () => {
    modal.classList.add('open2');
});

modalshow.addEventListener('click', () =>{
    html.classList.add('modal-bg');
});

//Modal hide
modalcancel.addEventListener('click', () => {
    modal.classList.remove('open2');
    html.classList.remove('modal-bg');
});

modalapply.addEventListener('click', () => {
    modal.classList.remove('open2');
    html.classList.remove('modal-bg');
});

// Filter show
filterBlock.addEventListener('click', (e) => {
    //не закрываем/открываем список фильтра до его замены
    if (e.target.closest('.hero__search-filter-choice-text')) return;

    //если клик не попал по пункту фильтра
    choiceList.classList.toggle('open');
});

//Filter select
choiceItems.forEach(item => {
    item.addEventListener('click', () => {
        const selectedText = item.querySelector('span').textContent.trim();
        filterName.textContent = selectedText;
        choiceList.classList.remove('open');
    });
});

// Close filter if click not in filter
document.addEventListener('click', (e) => {
    if (!filterBlock.contains(e.target)) {
        choiceList.classList.remove('open');
    }
});

