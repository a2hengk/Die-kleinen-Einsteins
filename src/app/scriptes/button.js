function initializeFlashcards() {
    const container = document.getElementById("karteikarten-container");
    const createBtn = document.querySelector(".create-button");

    if (!container || !createBtn) return;

    createBtn.addEventListener("click", () => {
        const newCard = document.createElement("div");
        newCard.classList.add("karteikarte", "karteikarte-new");
        newCard.innerHTML = `
            <button class="delete-button">-</button>
        `;
        container.appendChild(newCard);
    });

    container.addEventListener("click", (e) => {
        const target = e.target;

        if (!target) return;

        if (target instanceof HTMLElement && target.classList.contains("delete-button")) {
            const card = target.closest(".karteikarte") || target.closest(".karteikarte-new");
            card?.remove();
            return; 
        }

        if (target instanceof HTMLElement) {
            const card = target.closest(".karteikarte") || target.closest(".karteikarte-new");
            if (card) {
                card.classList.toggle("clicked");
            }
        }
    });
}

initializeFlashcards();

/*
function create_button() {
    var button = document.querySelector(".create-button");
    if (button) {
        button.addEventListener("click", function() {
            var newCard = document.createElement("div");
            newCard.classList.add("karteikarte");
            document.getElementById("karteikarten-container")?.appendChild(newCard);
        });
    }

}

function delete_button() {
    var deleteButtons = document.querySelectorAll(".delete-button");
    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var card = button.closest(".karteikarte");
            if (card) {
                card.remove();
            }
        });
    });
}


create_button();
delete_button();
*/