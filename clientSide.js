// // Not used in Chrome Extension, simply for seperation of function for editing purposes
async function clientSideActivation() {
  const roles = {
    licenseAdmin: "License Administrator",
    cloudDeviceAdmin: "Cloud Device Administrator",
    teamsAdmin: "Teams Administrator",
    globalReader: "Global Reader",
  };

  for (let roleTitle of selectedRoles) {
    try {
      await sleep(1000);

      async function gatherRoles() {
        const activateRoles = Array.from(
          document.getElementsByClassName(
            "ext-aad-role-grid-activate-deactivate-btn fxs-fxclick"
          )
        );

        const activeGroupRoles = (role) => {
          return (
            role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
              .getElementsByClassName("azc-grid-cell")
              .item(2).innerText != "Direct"
          );
        };

        return activateRoles.filter(activeGroupRoles);
      }

      const activateRoles = await gatherRoles();

      const waitForTextArea = async () => {
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 200;
          const interval = 200;

          const checkAvailability = setInterval(() => {
            const textArea = document.getElementsByClassName("azc-textarea")[0];
            const textAreaVisibility = textArea
              ? textArea.checkVisibility()
              : false;
            const ariaAvailable = textArea
              ? textArea.getAttribute("aria-disabled") === "false"
                ? true
                : false
              : false;

            if (textAreaVisibility && ariaAvailable) {
              clearInterval(checkAvailability);
              resolve(textArea);
            }
            attempts++;
            if (attempts >= maxAttempts) {
              clearInterval(checkAvailability);
              reject(
                new Error("Could not find text area for activation reason.")
              );
            }
          }, interval);
        });
      };

      const applyReasonConfirmActivation = async () => {
        return waitForTextArea()
          .then(async (textArea) => {
            textArea.value = roleActivationReason[0];
            const event = new Event("change");
            textArea.dispatchEvent(event);
            document.getElementsByClassName("fxs-button-text")[1].click();
            document
              .querySelector(
                'a[data-bind="fxclick: cancelRedirect, text: cancelRedirectText, visible: doTokenRefresh()"]'
              )
              .click();
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const roleName = (role, roleTitle) => {
        const roleText =
          role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
            .getElementsByClassName("azc-grid-cellContent")
            .item(0).innerText;

        if (roleText === roleTitle) {
          console.log("Activating selected role");
        }
        return roleText === roleTitle;
      };

      const activateRole = async (roleTitle, activateRoles) => {
        activateRoles.forEach((role) => {
          if (roleName(role, roleTitle)) {
            role.click();
          }
        });
        await applyReasonConfirmActivation();
      };
      await activateRole(roleTitle, activateRoles);
      sleep(1000);
      console.log("Successful activation of ", roleTitle);
    } catch (error) {
      console.log("Error activating ", roleTitle, error);
    }
  }
}

clientSideActivation();
