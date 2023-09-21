<template>
  <div class="container">
    <div class="toolbar">
      <div class="d-flex align-center">
        <va-button
          class="mr-3"
          :disabled="historyUndo.length === 0"
          @click="undo"
        >
          <img src="./assets/icons/undo.svg" alt="cancel" />
        </va-button>

        <va-button
          class="mr-3"
          :disabled="historyRedo.length === 0"
          @click="redo"
        >
          <img src="./assets/icons/redo.svg" alt="back" />
        </va-button>

        <va-button
          class="mr-3"
          :disabled="selectedTextLength < 0"
          @click="toUpperCase"
        >
          <img src="./assets/icons/T.svg" alt="toUppercase" />
        </va-button>

        <va-button
          class="mr-3"
          :disabled="selectedTextLength < 0"
          @click="toLowerCase"
        >
          <img src="./assets/icons/tt.svg" alt="toLowelCase" />
        </va-button>

        <va-button
          class="mr-3"
          :disabled="!caretShowed"
          @click="showImgForm"
        >
          <img src="./assets/icons/image.svg" alt="insertImg" />
        </va-button>

        <a href="#" class="va-link ml-3" @click="copyHtml">Скопировать HTML</a>
      </div>
    </div>

    <div class="content">
      <div class="visual-view" ref="visualView" contenteditable>
        <p>
          Таким образом консультация с широким активом представляет собой
          интересный эксперимент проверки позиций, занимаемых участниками в
          отношении поставленных задач. С другой стороны постоянное
          информационно-пропагандистское обеспечение нашей деятельности
          представляет собой интересный эксперимент проверки форм развития.
          Идейные соображения высшего порядка, а также укрепление и развитие
          структуры влечет за собой процесс внедрения и модернизации
          соответствующий условий активизации. Задача организации, в особенности
          же реализация намеченных плановых заданий играет важную роль в
          формировании дальнейших направлений развития. Повседневная практика
          показывает, что постоянное информационно-пропагандистское обеспечение
          нашей деятельности играет важную роль в формировании существенных
          финансовых и административных условий.
        </p>
        <h2>Смотрите какие обезьянки</h2>
        <img src="https://www.avalcotravel.com/wp-content/uploads/2020/08/scialpinismo-freeride-honshu-monkeys.jpg" alt="Обезьяны" />
        <p>
          Таким образом консультация с широким активом представляет собой
          интересный эксперимент проверки позиций, занимаемых участниками в
          отношении поставленных задач. С другой стороны постоянное
          информационно-пропагандистское обеспечение нашей деятельности
          представляет собой интересный эксперимент проверки форм развития.
          Идейные соображения высшего порядка, а также укрепление и развитие
          структуры влечет за собой процесс внедрения и модернизации
          соответствующий условий активизации. Задача организации, в особенности
          же реализация намеченных плановых заданий играет важную роль в
          формировании дальнейших направлений развития. Повседневная практика
          показывает, что постоянное информационно-пропагандистское обеспечение
          нашей деятельности играет важную роль в формировании существенных
          финансовых и административных условий.
        </p>
        <p>
          Товарищи! новая модель организационной деятельности требуют от нас
          анализа направлений прогрессивного развития. Задача организации, в
          особенности же постоянный количественный рост и сфера нашей активности
          требуют от нас анализа позиций, занимаемых участниками в отношении
          поставленных задач. Задача организации, в особенности же реализация
          намеченных плановых заданий требуют от нас анализа системы обучения
          кадров, соответствует насущным потребностям.
        </p>
      </div>
    </div>
  </div>

  <va-modal v-model="showModal" no-padding blur>
    <template #content>
      <va-card-title> Ссылка на изображение </va-card-title>
      <va-card-content>
        <va-input type="text" v-model="imageUrl" />
      </va-card-content>
      <va-card-actions>
        <va-button @click="placeImage">Добавить</va-button>
      </va-card-actions>
    </template>
  </va-modal>

</template>

<script setup>
import { ref, onMounted } from "vue";
import ClipboardJS from 'clipboard';

const visualView = ref(null);
const historyUndo = ref([]);
const historyRedo = ref([]);
const selectedTextLength = ref(0);
const showModal = ref(false);
const imageUrl = ref("");
const caretShowed = ref(false);
let clickedUndo = false;
let caretNode = null;

function highlight() {
  const elements = document.querySelectorAll(".visual-view > *");

  for (const el of elements) {
    if (el.classList.contains("active")) {
      el.classList.remove("active-el");
    }
  }

  if (this.nodeName === "IMG") {
    this.classList.add("active-el");
    removeSelection();
  }
}


function removeSelection() {
  const selection = window.getSelection();
  const docSelection = document.selection;

  if (selection) {
    if (selection.empty) {
      selection.empty();
    } else if (selection.removeAllRanges) {
      selection.removeAllRanges();
    }
  } else if (docSelection) {
    docSelection.empty();
  }
}

function cloneAndPush(source, destination) {
  destination.push(source.cloneNode(true));
}

function updateView(element, content) {
  element.replaceChildren(...content.children);
  document.querySelectorAll(".visual-view > *").forEach((el) => {
    el.addEventListener("click", highlight);
  });
}


//функции undo и redo должны активироваться, когда пользователь ввел любой символ или вставил изображение

function undo() {
  if (!clickedUndo) {
    cloneAndPush(visualView.value, historyRedo.value);
    cloneAndPush(historyUndo.value[historyUndo.value.length - 1], historyRedo.value);
  } else {
    if (historyRedo.value.length === 0) {
      cloneAndPush(historyUndo.value[historyUndo.value.length - 1], historyRedo.value);
      historyUndo.value.pop();
      cloneAndPush(historyUndo.value[historyUndo.value.length - 1], historyRedo.value);
    } else {
      cloneAndPush(historyUndo.value[historyUndo.value.length - 1], historyRedo.value);
    }
  }

  updateView(visualView.value, historyUndo.value[historyUndo.value.length - 1]);
  historyUndo.value.pop();
  clickedUndo = true;
}

function redo() {
  if (historyUndo.value.length === 0) {
    cloneAndPush(historyRedo.value[historyRedo.value.length - 1], historyUndo.value);
    historyRedo.value.pop();
    cloneAndPush(historyRedo.value[historyRedo.value.length - 1], historyUndo.value);
  } else {
    cloneAndPush(historyRedo.value[historyRedo.value.length - 1], historyUndo.value);
  }

  updateView(visualView.value, historyRedo.value[historyRedo.value.length - 1]);
  historyRedo.value.pop();
}

function transformTextToCase(casing) {
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const text = casing === 'upper' ? range.toString().toUpperCase() : range.toString().toLowerCase();
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
  } else {
    alert("Пожалуйста, сначала выделите текст");
  }
}

// Использование функции для преобразования в верхний и нижние регистры
function toUpperCase() {
  transformTextToCase('upper');
}

function toLowerCase() {
  transformTextToCase('lower');
}

function showImgForm() {
  showModal.value = true;
}

function placeImage() {
  const visualViewElement = visualView.value;

  if (!(visualViewElement instanceof HTMLElement)) {
    return;
  }

  // Создаем изображение
  const wrapElement = document.createElement("img");
  wrapElement.src = imageUrl.value;

  // Находим ближайший h2 тег
  let nearestH2 = caretNode;
  while (nearestH2 && nearestH2.nodeName.toLowerCase() !== "h2") {
    nearestH2 = nearestH2.previousElementSibling;
  }

  if (nearestH2) {
    // Если нашли ближайший h2 тег, вставляем изображение после него
    nearestH2.parentNode.insertBefore(wrapElement, nearestH2.nextSibling);
  } else {
    // Если не нашли h2 тег, вставляем изображение в конец visualView
    visualViewElement.appendChild(wrapElement);
  }

  // Обновляем caretNode
  caretNode = wrapElement;

  // Обновляем историю и сбрасываем redo
  historyUndo.value.push(visualViewElement.cloneNode(true));
  historyRedo.value = [];

  // Добавляем обработчики событий
  document.querySelectorAll(".visual-view > *").forEach((el) => {
    el.addEventListener("click", highlight);
  });

  imageUrl.value = "";
  showModal.value = false;
}

//для работы copyHtml в буфера обмена устанавлием clipboard командой npm install clipboard --save

const copyHtml = () => {
  const visualViewContent = document.querySelector('.visual-view').innerHTML;
  const clipboard = new ClipboardJS('.va-link', {
    text: () => visualViewContent,
  });

  clipboard.on('success', () => {
    clipboard.destroy();
    alert('HTML скопирован в буфер обмена.');
  });

  clipboard.on('error', () => {
    clipboard.destroy();
    alert('Копирование HTML не удалось.');
  });
};

function keyDownHandler(e) {
  const isSingleKey =
    e.key.length === 1 
    || e.key === "Delete" 
    || e.key === "Enter" 
    || e.key === "Backspace";

  if (isSingleKey && !e.ctrlKey) {
    handleUndo();
  }

  if (e.key === "Delete") {
    handleDelete();
  }

  if (e.key === "z" && e.ctrlKey && historyUndo.value.length > 0) {
    undo();
  }
}

function handleUndo() {
  const elem = visualView.value.cloneNode(true);
  historyUndo.value.push(elem);
  historyRedo.value = [];
  clickedUndo = false;
}

function handleDelete() {
  if (historyUndo.value.length === 0) {
    return;
  }

  historyUndo.value.pop();
  const selected = document.querySelector(".active-el");

  if (selected) {
    selected.classList.remove("active-el");
    const elem = visualView.value.cloneNode(true);
    historyUndo.value.push(elem);
    selected.remove();
  }
}


onMounted(() => {
  document.querySelectorAll(".visual-view > *").forEach((el) => {
    el.addEventListener("click", highlight);
  });
  document.addEventListener("click", (e) => {
    if (e.target.nodeName !== "IMG") {
      document.querySelectorAll(".visual-view > *").forEach((el) => {
        if (el.classList.value.includes("active")) {
          el.classList.remove("active-el");
        }
      });
    }
  });
  document.querySelector(".visual-view").addEventListener("mouseup", () => {
    try {
      if (window.getSelection) {
        caretShowed.value = true;
        caretNode = window.getSelection().getRangeAt(0)
          .startContainer.parentNode;
      }

      selectedTextLength.value = window
        .getSelection()
        .getRangeAt(0)
        .toString().length;
    } catch (error) {
      console.log();
    }
  });
  document
    .querySelector(".visual-view")
    .addEventListener("keydown", keyDownHandler);
});
</script>

