const updateButton = document.querySelector("#update-button");

const deleteButton = document.querySelector("#delete-button");

const messageDiv = document.querySelector("#message");

updateButton.addEventListener("click", () => {
  fetch("/quotes", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Darth Vader",
      quote: "I find your lack of faith disturbing.",
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((response) => {
      window.location.reload(true);
      console.log(response);
    });
});

deleteButton.addEventListener("click", () => {
  fetch("/quotes", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Darth Vader",
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((res) => {
      if (res === "No Vader quote to delete") {
        messageDiv.textContent = "No Darth Vader quote to delete";
      } else {
        window.location.reload();
      }
    })
    .catch((err) => console.error(err));
});
