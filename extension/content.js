function addContainer() {
  const container = document.createElement("div");
  container.id = "my-container";
  container.innerText = "This is my container";

  const targetElement = document.getElementById("secondary-inner");
  if (targetElement) {
    targetElement.insertBefore(container, targetElement.firstChild);
  }
}

const observer = new MutationObserver((mutations, obs) => {
  const targetElement = document.getElementById("secondary-inner");
  if (targetElement) {
    addContainer();
    obs.disconnect();
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});
