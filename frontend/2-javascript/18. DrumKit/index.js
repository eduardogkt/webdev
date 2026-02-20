const wSound = new Audio("./sounds/tom-1.mp3");

const sounds = [
    { id: "w", audio: new Audio("./sounds/tom-1.mp3") },
    { id: "a", audio: new Audio("./sounds/tom-2.mp3") },
    { id: "s", audio: new Audio("./sounds/tom-3.mp3") },
    { id: "d", audio: new Audio("./sounds/tom-4.mp3") },
    { id: "j", audio: new Audio("./sounds/snare.mp3") },
    { id: "k", audio: new Audio("./sounds/crash.mp3") },
    { id: "l", audio: new Audio("./sounds/kick-bass.mp3") },
];

document.querySelectorAll(".drum").forEach((btn) => {
    btn.addEventListener("click", function () {
        makeSound(this.innerHTML);
        buttonAnimation(this.innerHTML);
    });
});

document.addEventListener("keydown", (event) => {
    makeSound(event.key);
    buttonAnimation(event.key);
});

function makeSound(id) {
    const sound = sounds.find((sound) => sound.id === id);
    sound?.audio.play();
}

function buttonAnimation(id) {
    const button = document.querySelector(`.${id}`);
    if (button) {
        button.classList.add("pressed");
        setTimeout(() => {
            button.classList.remove("pressed");
        }, 100);
    }
}
