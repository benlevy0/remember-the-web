chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "create_flashcard") {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      fetch("http://localhost:8080/remember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Server responded with an error");
          return response.json();
        })
        .then((data) => {
          chrome.runtime.sendMessage({ status: "success" });
        })
        .catch((error) => {
          chrome.runtime.sendMessage({
            status: "failure",
            reason: error.message,
          });
        });
    } else {
      chrome.runtime.sendMessage({
        status: "failure",
        reason: "No text selected",
      });
    }
  }
});
