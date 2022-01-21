const form = document.querySelector(".form");
const buttonLesson = document.querySelector(".main__container");
const showForm = document.querySelector(".contact__button");
const closeForm = document.querySelector(".form__close-button");
const KEY_ESC= 27;
const anchors = document.querySelectorAll('.main-nav__link--anchor');


buttonLesson.addEventListener('click', () => {
    form.classList.add("form-show");
});

showForm.addEventListener('click', () => {
    form.classList.add("form-show");
});

closeForm.addEventListener('click', () => {
    form.classList.remove("form-show");
});

document.addEventListener('keydown', (evt) => {
    if (evt.keyCode === KEY_ESC) {
        form.classList.remove("form-show");
    }
});


for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const blockID = anchor.getAttribute('href').substr(1)

        document.getElementById(blockID).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        }, 400)
    })
};