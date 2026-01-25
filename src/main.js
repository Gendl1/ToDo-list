import './styles/_variables.scss'
import './styles/main.scss'

// Filter vars
const filterBlock  = document.querySelector('.hero__search-filter');
const filterName   = document.querySelector('.hero__search-filter-name');
const choiceList   = document.querySelector('.hero__search-filter-choice');
const choiceItems  = document.querySelectorAll('.hero__search-filter-choice-text');

//Add Notes vars
const overlay = document.querySelector('.modal-overlay');
const addBtn   = document.querySelector('.notes__add-button');
const cancelBtn = document.querySelector('.modal__buttons-cancel');
const applyBtn  = document.querySelector('.modal__buttons-apply');
const noteInput = document.querySelector('#note-input');
const notesList = document.querySelector('.notes__list');
let noteBeingEdited = null;   // хранит ссылку на <li>, который редактируем

//Theme switch vars
const themeBtn = document.querySelector('.hero__search-dark-theme');
let isDark= false;

//Open modal
function openModal() {
    overlay.classList.add('open');
}

//Open modal through Add Note btn
addBtn.addEventListener('click', openModal);

//Close modal
function closeModal() {
    overlay.classList.remove('open');
}

//Close modal through cancel btn
cancelBtn.addEventListener('click', closeModal);

// Close modal if click not on modal
overlay.addEventListener('click', e => {
    if (e.target === overlay) {
        closeModal();
    }
});

//Add note and edit note 
applyBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();

    if (text === '') {
        alert('Пожалуйста, введите текст заметки');
        return;
    }

    if (noteBeingEdited) {
        //Редактирование заметки 
        const textSpan = noteBeingEdited.querySelector('.notes__list-item-content-text');
        if (textSpan) {
            textSpan.textContent = text;
        }
        noteBeingEdited = null;

    } 

    else {
        //Создание заметки
        const li = document.createElement('li');
        li.className = 'notes__list-item';

        li.innerHTML = `
            <input type="checkbox" id="note-checkbox" class="notes__list-item-checkbox">
            <div class="notes__list-item-content">
                <span class="notes__list-item-content-text">${text}</span>
                <div class="notes__list-item-content-img">
                    <div class="notes__list-item-content-img-edit">
                        <img src="./public/images/edit-note.svg">
                    </div>
                    <div class="notes__list-item-content-img-delete">
                        <img src="./public/images/delete-note.svg">
                    </div>
                </div>
            </div>
        `;

        notesList.appendChild(li);
    }

    closeModal();
});

// Open modal for editing note and delete note
notesList.addEventListener('click', function(e) {
    
    // клик по иконке редактирования
    if (e.target.closest('.notes__list-item-content-img-edit')) {
        const noteItem = e.target.closest('.notes__list-item');

        if (!noteItem) return;

        const textSpan = noteItem.querySelector('.notes__list-item-content-text');
        if (!textSpan) return;

        // запоминаем заметку, которую редактируем
        noteBeingEdited = noteItem;

        // Заранее заполняем поле изначальным текстом заметки
        noteInput.value = textSpan.textContent.trim();

        // открываем модалку
        openModal();
        noteInput.focus();
        noteInput.select();   // выделение изначального текста
    }

    //клик по иконке удаления
    if (e.target.closest('.notes__list-item-content-img-delete')) {
        const deleteArea = e.target.closest('.notes__list-item-content-img-delete');

        if (deleteArea) {
            // находим ближайшую заметку (li)
            const noteItem = deleteArea.closest('.notes__list-item');

            if (noteItem) {
                // можно добавить подтверждение (рекомендую)
                if (confirm('Удалить эту заметку?')) {
                    noteItem.remove();
                }
            }
        }
    }
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

//Theme switch
themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('dark', isDark);

    const elementsToChange = [
        document.querySelector('.hero__search-input'),
        document.querySelector('.html'),
        document.querySelector('.hero__title'),
        document.querySelector('.modal'),
        document.querySelector('.modal__buttons-cancel'),
        document.querySelector('.modal__title'),
        document.querySelector('.hero__search-input-area'),
        document.querySelector('.modal__input')
    ];

    elementsToChange.forEach(el => el?.classList.toggle('dark', isDark));

    // переключение сразу все текстов заметок
    document.querySelectorAll('.notes__list-item-content-text')
        .forEach(el => el.classList.toggle('dark', isDark));
        
    //Переключение картинки
    themeBtn.querySelector('img')?.setAttribute('src', isDark ? './public/images/dark_theme.svg' : './public/images/light_theme.svg');
});

