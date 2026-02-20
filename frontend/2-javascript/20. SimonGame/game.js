const buttonColors = ["red", "blue", "green", "yellow"];
const sounds = [
    { id: "red", sound: new Audio("./sounds/red.mp3") },
    { id: "blue", sound: new Audio("./sounds/blue.mp3") },
    { id: "green", sound: new Audio("./sounds/green.mp3") },
    { id: "yellow", sound: new Audio("./sounds/yellow.mp3") },
    { id: "wrong", sound: new Audio("./sounds/wrong.mp3") },
];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
let started = false;

$(document).on("keydown", () => {
    if (!started) {
        started = true;
        nextSequence();
    }
});

$(".btn").on("click", function () {
    let userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    const rand = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColors[rand];

    gamePattern.push(randomChosenColour);
    showColorSequence();
}

function showColorSequence() {
    gamePattern.forEach((color, idx) => {
        setTimeout(
            () => {
                $(`#${color}`).fadeIn(100).fadeOut(100).fadeIn(100);
                playSound(color);
            },
            1000 + 1000 * idx,
        );
    });
}

function playSound(id) {
    const sound = sounds.find((sound) => sound.id === id);
    sound.sound.play();
}

function animatePress(currentColor) {
    const colorBtn = $(`#${currentColor}`);
    colorBtn.addClass("pressed");
    setTimeout(() => colorBtn.removeClass("pressed"), 100);
}

function checkAnswer(currLevel) {
    if (userClickedPattern[currLevel] === gamePattern[currLevel]) {
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(nextSequence, 1000);
        }
    } else {
        playSound("wrong");

        $("body").addClass("game-over");
        setTimeout(() => $("body").removeClass("game-over"), 200);

        $("#level-title").text("Game Over, Press Any Key to Restart");

        startOver();
    }
}

function startOver() {
    level = 0;
    started = false;
    gamePattern = [];
    userClickedPattern = [];
}
