function button() {
    var button = document.querySelector(".create-button");
    if (button) {
        button.addEventListener("click", function() {
            var newCard = document.createElement("div");
            newCard.classList.add("karteikarte");
            document.getElementById("karteikarten-container")?.appendChild(newCard);
        });
    }

}

button();