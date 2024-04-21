chrome.commands.onCommand.addListener((command) => {
  if (command === "create_flashcard") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "create_flashcard" });
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.status === "success") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/success.png",
      title: "Flashcard Creation",
      message: "Flashcard created successfully!",
      priority: 2,
    });
  } else if (message.status === "failure") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/failure.png",
      title: "Flashcard Creation Failed",
      message: message.reason,
      priority: 2,
    });
  }
});
