chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateRoles") {
    clientSideActivation(request.selectedRoles);
  }
});
