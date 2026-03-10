let correctCount = 0;
let wrongCount = 0;

const rightButton = document.getElementById('right');
const wrongButton = document.getElementById('wrong');
const correctCountDisplay = document.getElementById('correct-count');
const wrongCountDisplay = document.getElementById('wrong-count');

rightButton.addEventListener('click', () => {
    correctCount++;
    correctCountDisplay.textContent = correctCount;
});

wrongButton.addEventListener('click', () => {
    wrongCount++;
    wrongCountDisplay.textContent = wrongCount;
});
