// const roles = {
//   userAdmin: "User Administrator",
//   helpDeskAdmin: "Helpdesk Administrator",
//   serviceSupportAdmin: "Service Support Administrator",
//   exchangeAdmin: "Exchange Administrator",
//   sharepointAdmin: "SharePoint Administrator",
//   skypeForBusinessAdmin: "Skype for Business Administrator",
//   complianceAdmin: "Compliance Administrator",
//   securityReader: "Security Reader",
//   dynamics365Admin: "Dynamics 365 Administrator",
//   fabricAdmin: "Fabric Administrator",
//   reportsReader: "Reports Reader",
//   licenseAdmin: "License Administrator",
//   cloudDeviceAdmin: "Cloud Device Administrator",
//   teamsAdmin: "Teams Administrator",
//   globalReader: "Global Reader",
//   groupsAdmin: "Groups Administrator",
//   powerPlatformAdmin: "Power Platform Administrator",
//   officeAppsAdmin: "Office Apps Administrator",
//   yammerAdmin: "Yammer Administrator",
// };

// // Dynamically generate checkboxes for each role
// const roleForm = document.getElementById("roleForm");
// for (const key in roles) {
//   if (roles.hasOwnProperty(key)) {
//     const label = document.createElement("label");
//     const checkbox = document.createElement("input");

//     checkbox.type = "checkbox";
//     checkbox.value = roles[key];
//     label.appendChild(checkbox);
//     label.appendChild(document.createTextNode(` ${roles[key]}`));

//     roleForm.appendChild(label);
//     roleForm.appendChild(document.createElement("br"));
//   }
// }

document
  .getElementById("activateRolesBtn")
  .addEventListener("click", async () => {
    const selectedRoles = [];
    document
      .querySelectorAll('input[type="checkbox"]:checked')
      .forEach((checkbox) => {
        selectedRoles.push(checkbox.value);
      });

    // Send the selected roles to content.js
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: activateClientSideRoles,
        args: [selectedRoles],
      });
    });
  });

document
  .getElementById("generateRolesBtn")
  .addEventListener("click", async () => {
    // Retrieve roles directly from the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractAvailableRoles, // Function to extract roles from the Azure page
          args: [],
          world: "MAIN", // Ensures the script runs in the context of the page
        },
        (results) => {
          // Assuming the available roles will be returned in 'results'
          const availableRoles = results[0].result;
          console.log("Available Roles: ", availableRoles);

          // Update the roleForm with available roles
          roleForm.innerHTML = ""; // Clear existing checkboxes

          availableRoles.forEach((roleString) => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.value = roleString;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${roleString}`));

            roleForm.appendChild(label);
            roleForm.appendChild(document.createElement("br"));
          });
        }
      );
    });
  });

function extractAvailableRoles() {
  const activateRoles = Array.from(
    document.getElementsByClassName(
      "ext-aad-role-grid-activate-deactivate-btn fxs-fxclick"
    )
  );

  const activeDirectRoles = (role) => {
    return (
      role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
        .getElementsByClassName("azc-grid-cell")
        .item(2).innerText === "Direct"
    );
  };

  const filteredRoles = activateRoles.filter(activeDirectRoles);

  const availableRoles = [];
  filteredRoles.forEach((role) => {
    const roleName =
      role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
        .getElementsByClassName("azc-grid-cell")
        .item(0).innerText;
    availableRoles.push(roleName);
  });

  return availableRoles;
}

function activateClientSideRoles(selectedRoles) {
  const roleActivationReason = [
    "Daily IT Administration Tasks in Azure Entra and MS Admin Center.",
  ];

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

          const activeDirectRoles = (role) => {
            return (
              role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
                .getElementsByClassName("azc-grid-cell")
                .item(2).innerText === "Direct"
            );
          };

          return activateRoles.filter(activeDirectRoles);
        }

        const activateRoles = await gatherRoles();

        const waitForTextArea = async () => {
          return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 200;
            const interval = 200;

            const checkAvailability = setInterval(() => {
              const textArea =
                document.getElementsByClassName("azc-textarea")[0];
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
        console.log("Error activating ", roleTitle);
      }
    }
  }

  clientSideActivation();
}
