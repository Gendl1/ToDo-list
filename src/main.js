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

//Theme switch vars
const themeBtn = document.querySelector('.hero__search-theme');

//Search notes vars
const searchInput = document.querySelector('.hero__search-input-area');

//Open modal
function openModal() {
    overlay.classList.add('open');
    noteInput.value = ''
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
    
    if (text === '') {
        alert('Пожалуйста, введите текст заметки');
        return;
    }

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

//Edit note function
function editNote(){
    const text = noteInput.value.trim();

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
}

//Add note and edit note 
applyBtn.addEventListener('click', () => {
    editNote();
    closeModal();
});

// Open modal for editing note and delete note
function noteEdit(e) {
    if (!e.target.closest('.notes__list-item-content-img-edit')) return;

    const noteItem = e.target.closest('.notes__list-item');
    if (!noteItem) return;

    const textSpan = noteItem.querySelector('.notes__list-item-content-text');
    if (!textSpan) return;

    noteBeingEdited = noteItem;

    openModal();
    noteInput.focus();
}

// Обработчик клика по иконке удаления
function noteDelete(e) {
    const deleteBtn = e.target.closest('.notes__list-item-content-img-delete');
    if (!deleteBtn) return;

    const noteItem = deleteBtn.closest('.notes__list-item');
    if (!noteItem) return;

    if (confirm('Удалить эту заметку?')) {
        noteItem.remove();
    }
}

notesList.addEventListener('click', function(e) {
    noteEdit(e);
    noteDelete(e);
});

// Filter show
filterBlock.addEventListener('click', (e) => {
    //не закрываем/открываем список фильтра до его замены
    if (e.target.closest('.hero__search-filter-choice-text')) return;

    //если клик не попал по пункту фильтра
    choiceList.classList.toggle('open');
});

//Filter select
function filterSelect(item) {
    // Получаем текст выбранного пункта
    const selectedText = item.querySelector('span')?.textContent?.trim() ?? '';

    // Обновляем отображаемый текст фильтра
    filterName.textContent = selectedText;

    // Закрываем выпадающий список
    choiceList.classList.remove('open');
}

choiceItems.forEach(item => {
    item.addEventListener('click', () => {
        filterSelect(item);
    });
});

// Close filter if click not in filter
document.addEventListener('click', (e) => {
    if (!filterBlock.contains(e.target)) {
        choiceList.classList.remove('open');
    }
});

//Theme switch
function themeSwitch(){
    document.documentElement.classList.toggle('dark');

    const img = themeBtn.querySelector('img');
    if (img) {
        const isDarkNow = document.documentElement.classList.contains('dark');
        img.src = isDarkNow 
            ? './public/images/dark_theme.svg' 
            : './public/images/light_theme.svg';
    }
}

//Theme switch
themeBtn.addEventListener('click', () => {
    themeSwitch();
});

function notesSearch() {
    const query = searchInput.value.trim().toLowerCase();

    document.querySelectorAll('.notes__list-item').forEach(note => {
        const text = note.querySelector('.notes__list-item-content-text')?.textContent?.toLowerCase();

        if (query === '' || text.includes(query)) {
            note.classList.remove('search-hidden');
        } else {
            note.classList.add('search-hidden');
        }
    });
}
//Notes search
searchInput.addEventListener('input', () => {
    notesSearch();
});

// Обработка чекбокса
function handleNoteCheckboxChange(checkbox) {
    const noteItem = checkbox.closest('.notes__list-item');
    
    if (noteItem) {
        const isChecked = checkbox.checked;
        noteItem.classList.toggle('completed', isChecked);
    }
}

notesList.addEventListener('change', e => {
    if (e.target.matches('.notes__list-item-checkbox')) {
        handleNoteCheckboxChange(e.target);
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


function handleFilterChoiceClick(choice) {
    // Убираем active со всех
    filterChoices.forEach(c => c.classList.remove('active'));

    // Добавляем active выбранному
    choice.classList.add('active');

    // Получаем значение фильтра
    const value = choice.dataset.value.toLowerCase();
    currentFilter = value;

    // Обновляем видимый текст
    filterName.textContent = choice.querySelector('span').textContent;

    // Закрываем выпадашку
    choiceList.classList.remove('open');

    // Применяем фильтр
    applyFilter();
}

filterChoices.forEach(choice => {
    choice.addEventListener('click', () => {
        handleFilterChoiceClick(choice);
    });
});

function defaultchoise(){
    const allChoice = document.querySelector('.hero__search-filter-choice-text[data-value="All"]');
    if (allChoice) {
        allChoice.click();  // программно кликаем → применится фильтр "all"
    }
}

// Чтобы по умолчанию был выбран "All"
document.addEventListener('DOMContentLoaded', () => {
    defaultchoise();
});