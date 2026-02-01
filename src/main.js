import './styles/_variables.scss'
import './styles/main.scss'

// Filter vars
const filterBlock  = document.querySelector('.hero__search-filter');
const filterName   = document.querySelector('.hero__search-filter-name');
const choiceList   = document.querySelector('.hero__search-filter-choice');
const choiceItems  = document.querySelectorAll('.hero__search-filter-choice-text');
let currentFilter = 'all';  // 'all' | 'complete' | 'incomplete'

//Add Notes vars
const overlay = document.querySelector('.modal-overlay');
const addBtn   = document.querySelector('.notes__add-button');
const cancelBtn = document.querySelector('.modal__buttons-cancel');
const applyBtn  = document.querySelector('.modal__buttons-apply');
const noteInput = document.querySelector('#note-input');
const notesList = document.querySelector('.notes__list');
let noteBeingEdited = null;
const noteTemplate = document.querySelector('#note-template');

if (!noteTemplate) {
    console.error('Шаблон #note-template не найден!');
    
}

//Theme switch vars
const themeBtn = document.querySelector('.hero__search-dark-theme');

//Search notes vars
const searchInput = document.querySelector('.hero__search-input-area');

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

//Add note function
function createNoteElement(text) {
    // Клонируем содержимое шаблона
    const templateContent = noteTemplate.content.cloneNode(true);
    const noteElement = templateContent.querySelector('.notes__list-item');
    const textSpan = noteElement.querySelector('.notes__list-item-content-text');
    
    // Устанавливаем текст
    textSpan.textContent = text;
    
    // Проверка темы
    const isCurrentlyDark = document.body.classList.contains('dark');
    if (isCurrentlyDark) {
        textSpan.classList.add('dark');
    }
    
    return noteElement;
}

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
        const noteElement = createNoteElement(text);
        notesList.appendChild(noteElement)
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
    document.documentElement.classList.toggle('dark');

    // Смена иконки 
    const img = themeBtn.querySelector('img');
    if (img) {
        const isDarkNow = document.documentElement.classList.contains('dark');
        img.src = isDarkNow 
            ? './public/images/dark_theme.svg' 
            : './public/images/light_theme.svg';
    }
});

//Notes search
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll('.notes__list-item').forEach(note => {
        const text = note.querySelector('.notes__list-item-content-text')?.textContent?.toLowerCase();

        if (query === '' || text.includes(query)) {
            note.classList.remove('search-hidden');
        } else {
            note.classList.add('search-hidden');
        }
    });
});


// Обработка чекбокса
notesList.addEventListener('change', e => {
    if (e.target.matches('.notes__list-item-checkbox')) {
        const noteItem = e.target.closest('.notes__list-item');

        if (noteItem) {
            const checked = e.target.checked;
            noteItem.classList.toggle('completed', checked);
        }
    }
});

// Функция применения фильтра
function applyFilter() {
    document.querySelectorAll('.notes__list-item').forEach(item => {
    const isCompleted = item.classList.contains('completed');

    let shouldShow = true;

    if (currentFilter === 'complete') {
        shouldShow = isCompleted;
    } 
    
    else if (currentFilter === 'incomplete') {
        shouldShow = !isCompleted;
    }
    // 'all' → показываем всех

    item.classList.toggle('hidden', !shouldShow);
    });
}

// Находим все пункты в выпадающем списке
const filterChoices = document.querySelectorAll('.hero__search-filter-choice-text');

filterChoices.forEach(choice => {
    choice.addEventListener('click', () => {
    // Убираем активный класс со всех пунктов
    filterChoices.forEach(c => c.classList.remove('active'));

    // Добавляем активный класс выбранному
    choice.classList.add('active');

    // Получаем значение фильтра
    const value = choice.dataset.value.toLowerCase(); 

    currentFilter = value;

    // Меняем видимый текст фильтра
    filterName.textContent = choice.querySelector('span').textContent;

    // Закрываем выпадающий список
    choiceList.classList.remove('open');

    // Применяем фильтр
    applyFilter();
    });
});

// Чтобы по умолчанию был выбран "All"
document.addEventListener('DOMContentLoaded', () => {
    const allChoice = document.querySelector('.hero__search-filter-choice-text[data-value="All"]');
    if (allChoice) {
        allChoice.click();  // программно кликаем → применится фильтр "all"
    }
});