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