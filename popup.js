// document
//   .getElementById("activateRolesBtn")
//   .addEventListener("click", async () => {
//     const selectedDirectRoles = [];
//     document
//       .getElementById("roleFormDirectRoles")
//       .querySelectorAll('input[type="checkbox"]:checked')
//       .forEach((checkbox) => {
//         selectedDirectRoles.push(checkbox.value);
//       });
//     const selectedGroupRoles = [];
//     document
//       .getElementById("roleFormGroupRoles")
//       .querySelectorAll('input[type="checkbox"]:checked')
//       .forEach((checkbox) => {
//         selectedGroupRoles.push(checkbox.value);
//       });

//     const selectedRoles = selectedDirectRoles
//       .map((item) => [item, "Direct"])
//       .concat(selectedGroupRoles.map((item) => [item, "Group"]));

//     // Send the selected roles to content.js
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         func: activateClientSideRoles,
//         args: [selectedRoles],
//       });
//     });
//   });

// document
//   .getElementById("generateRolesBtn")
//   .addEventListener("click", async () => {
//     // Retrieve roles directly from the active tab
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript(
//         {
//           target: { tabId: tabs[0].id },
//           func: extractAvailableRoles, // Function to extract roles from the Azure page
//           args: [],
//           world: "MAIN", // Ensures the script runs in the context of the page
//         },
//         (results) => {
//           const roleFormDirectRoles = document.getElementById(
//             "roleFormDirectRoles"
//           );
//           const roleFormGroupRoles =
//             document.getElementById("roleFormGroupRoles");
//           // Assuming the available roles will be returned in 'results'
//           const [directRoles, groupRoles] = results[0].result;
//           console.log("Direct Roles: ", directRoles);
//           console.log("Group Roles: ", groupRoles);
//           // Update the roleForm with available roles
//           roleFormDirectRoles.innerHTML = ""; // Clear existing checkboxes
//           if (directRoles.length != 0) {
//             const title = document.createElement("h2");
//             title.innerText = "Directly assigned roles:";
//             roleFormDirectRoles.appendChild(title);
//             directRoles.forEach((roleString) => {
//               const label = document.createElement("label");
//               const checkbox = document.createElement("input");

//               checkbox.type = "checkbox";
//               checkbox.value = roleString;
//               label.appendChild(checkbox);
//               label.appendChild(document.createTextNode(` ${roleString}`));

//               roleFormDirectRoles.appendChild(label);
//               roleFormDirectRoles.appendChild(document.createElement("br"));
//             });
//           }
//           roleFormGroupRoles.innerHTML = "";
//           if (groupRoles.length != 0) {
//             const title = document.createElement("h2");
//             title.innerText = "Group assigned roles:";
//             roleFormGroupRoles.appendChild(title);
//             groupRoles.forEach((roleString) => {
//               const label = document.createElement("label");
//               const checkbox = document.createElement("input");

//               checkbox.type = "checkbox";
//               checkbox.value = roleString;
//               label.appendChild(checkbox);
//               label.appendChild(document.createTextNode(` ${roleString}`));

//               roleFormGroupRoles.appendChild(label);
//               roleFormGroupRoles.appendChild(document.createElement("br"));
//             });
//           }
//         }
//       );
//     });
//   });

// function extractGroupRoles(activateRoles) {
//   const activeGroupRoles = (role) => {
//     return (
//       role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
//         .getElementsByClassName("azc-grid-cell")
//         .item(2).innerText != "Direct"
//     );
//   };
//   const nonDirectRoles = activateRoles.filter(activeGroupRoles);
//   const nonDirectAvailableRoles = [];
//   nonDirectRoles.forEach((role) => {
//     const roleName =
//       role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
//         .getElementsByClassName("azc-grid-cell")
//         .item(0).innerText;
//     nonDirectAvailableRoles.push(roleName);
//   });
//   return nonDirectAvailableRoles;
// }

// function extractDirectRoles(activateRoles) {
//   const activeDirectRoles = (role) => {
//     return (
//       role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
//         .getElementsByClassName("azc-grid-cell")
//         .item(2).innerText != "Direct"
//     );
//   };
//   const directRoles = activateRoles.filter(activeDirectRoles);
//   const directAvailableRoles = [];
//   directRoles.forEach((role) => {
//     const roleName =
//       role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
//         .getElementsByClassName("azc-grid-cell")
//         .item(0).innerText;
//     directAvailableRoles.push(roleName);
//   });
//   return directAvailableRoles;
// }

// function extractAvailableRoles() {
//   const activateRoles = Array.from(
//     document.getElementsByClassName(
//       "ext-aad-role-grid-activate-deactivate-btn fxs-fxclick"
//     )
//   );

//   return [extractDirectRoles(activateRoles), extractGroupRoles(activateRoles)];
// }

// function activateClientSideRoles(selectedRoles) {
//   const roleActivationReason = [
//     "Daily IT Administration Tasks in Azure Entra and MS Admin Center.",
//   ];

//   async function sleep(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   async function clientSideActivation(selectedRoles) {
//     for (let [roleTitle, type] of selectedRoles) {
//       try {
//         await sleep(1000);

//         async function gatherRoles() {
//           const activateRoles = Array.from(
//             document.getElementsByClassName(
//               "ext-aad-role-grid-activate-deactivate-btn fxs-fxclick"
//             )
//           );

//           const activeGroupRoles = (role) => {
//             return (
//               role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
//                 .getElementsByClassName("azc-grid-cell")
//                 .item(2).innerText != "Direct"
//             );
//           };
//           const scrapedGroupRoles = activateRoles.filter(activeGroupRoles);
//           const scrapedDirectRoles = activateRoles.filter(
//             (item) => !scrapedGroupRoles.includes(item)
//           );
//           return [scrapedGroupRoles, scrapedDirectRoles];
//         }

//         const [groupAssignments, directAssignments] = await gatherRoles();

//         const waitForTextArea = async () => {
//           return new Promise((resolve, reject) => {
//             let attempts = 0;
//             const maxAttempts = 200;
//             const interval = 200;

//             const checkAvailability = setInterval(() => {
//               const textArea =
//                 document.getElementsByClassName("azc-textarea")[0];
//               const textAreaVisibility = textArea
//                 ? textArea.checkVisibility()
//                 : false;
//               const ariaAvailable = textArea
//                 ? textArea.getAttribute("aria-disabled") === "false"
//                   ? true
//                   : false
//                 : false;

//               if (textAreaVisibility && ariaAvailable) {
//                 clearInterval(checkAvailability);
//                 resolve(textArea);
//               }
//               attempts++;
//               if (attempts >= maxAttempts) {
//                 clearInterval(checkAvailability);
//                 reject(
//                   new Error("Could not find text area for activation reason.")
//                 );
//               }
//             }, interval);
//           });
//         };

//         const applyReasonConfirmActivation = async () => {
//           return waitForTextArea()
//             .then(async (textArea) => {
//               textArea.value = roleActivationReason[0];
//               const event = new Event("change");
//               textArea.dispatchEvent(event);
//               document.getElementsByClassName("fxs-button-text")[1].click();
//               document
//                 .querySelector(
//                   'a[data-bind="fxclick: cancelRedirect, text: cancelRedirectText, visible: doTokenRefresh()"]'
//                 )
//                 .click();
//             })
//             .catch((error) => {
//               console.log(error);
//             });
//         };

//         const roleName = (role, roleTitle) => {
//           const roleText =
//             role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
//               .getElementsByClassName("azc-grid-cellContent")
//               .item(0).innerText;

//           if (roleText === roleTitle) {
//             console.log("Activating selected role");
//           }
//           return roleText === roleTitle;
//         };

//         const activateRole = async (roleTitle, activateRoles) => {
//           activateRoles.forEach((role) => {
//             if (roleName(role, roleTitle)) {
//               role.click();
//             }
//           });
//           await applyReasonConfirmActivation();
//         };
//         if (groupAssignments != 0 && type == "Group") {
//           await activateRole(roleTitle, groupAssignments);
//         }
//         if (directAssignments != 0 && type == "Direct") {
//           await activateRole(roleTitle, directAssignments);
//         }

//         sleep(1000);
//         console.log("Successful activation of ", roleTitle);
//       } catch (error) {
//         console.log("Error activating ", roleTitle, error);
//       }
//     }
//   }

//   clientSideActivation();
// }

document
  .getElementById("activateRolesBtn")
  .addEventListener("click", async () => {
    const selectedDirectRoles = Array.from(
      document
        .getElementById("roleFormDirectRoles")
        .querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);
    const selectedGroupRoles = Array.from(
      document
        .getElementById("roleFormGroupRoles")
        .querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value);

    const selectedRoles = selectedDirectRoles
      .map((item) => [item, "Direct"])
      .concat(selectedGroupRoles.map((item) => [item, "Group"]));

    console.log(selectedRoles);

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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: extractAvailableRoles,
          args: [],
          world: "MAIN",
        },
        (results) => {
          console.log(results[0].result);

          const roleFormDirectRoles = document.getElementById(
            "roleFormDirectRoles"
          );
          const roleFormGroupRoles =
            document.getElementById("roleFormGroupRoles");
          const [directRoles, groupRoles] = results[0].result;

          roleFormDirectRoles.innerHTML = "";
          roleFormGroupRoles.innerHTML = "";

          if (directRoles && directRoles.length > 0) {
            const title = document.createElement("h2");
            title.innerText = "Directly assigned roles:";
            title.style.fontSize = "12px";
            roleFormDirectRoles.appendChild(title);

            directRoles.forEach((roleString) => {
              const label = document.createElement("label");
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.value = roleString;
              label.appendChild(checkbox);
              label.appendChild(document.createTextNode(` ${roleString}`));
              roleFormDirectRoles.appendChild(label);
              roleFormDirectRoles.appendChild(document.createElement("br"));
            });
          }

          if (groupRoles && groupRoles.length > 0) {
            const title = document.createElement("h2");
            title.innerText = "Group assigned roles:";
            title.style.fontSize = "12px";
            roleFormGroupRoles.appendChild(title);

            groupRoles.forEach((roleString) => {
              const label = document.createElement("label");
              const checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.value = roleString;
              label.appendChild(checkbox);
              label.appendChild(document.createTextNode(` ${roleString}`));
              roleFormGroupRoles.appendChild(label);
              roleFormGroupRoles.appendChild(document.createElement("br"));
            });
          }
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
  function extractGroupRoles(activateRoles) {
    const activeGroupRoles = (role) => {
      return (
        role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
          .getElementsByClassName("azc-grid-cell")
          .item(2).innerText !== "Direct"
      );
    };
    const nonDirectRoles = activateRoles.filter(activeGroupRoles);
    const nonDirectAvailableRoles = [];
    nonDirectRoles.forEach((role) => {
      const roleName =
        role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
          .getElementsByClassName("azc-grid-cell")
          .item(0).innerText;
      nonDirectAvailableRoles.push(roleName);
    });
    return nonDirectAvailableRoles;
  }
  function extractDirectRoles(activateRoles) {
    const activeDirectRoles = (role) => {
      return (
        role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
          .getElementsByClassName("azc-grid-cell")
          .item(2).innerText === "Direct"
      );
    };
    const directRoles = activateRoles.filter(activeDirectRoles);
    const directAvailableRoles = [];
    directRoles.forEach((role) => {
      const roleName =
        role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
          .getElementsByClassName("azc-grid-cell")
          .item(0).innerText;
      directAvailableRoles.push(roleName);
    });
    return directAvailableRoles;
  }
  return [extractDirectRoles(activateRoles), extractGroupRoles(activateRoles)];
}

function activateClientSideRoles(selectedRoles) {
  const roleActivationReason = [
    "Daily IT Administration Tasks in Azure Entra and MS Admin Center.",
  ];

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function clientSideActivation(selectedRoles) {
    for (let [roleTitle, type] of selectedRoles) {
      try {
        await sleep(1000);

        async function gatherRoles() {
          const activateRoles = Array.from(
            document.getElementsByClassName(
              "ext-aad-role-grid-activate-deactivate-btn fxs-fxclick"
            )
          );
          const activeGroupRoles = (role) =>
            role.parentNode.parentNode.parentElement.parentElement.parentElement.parentElement.parentElement
              .getElementsByClassName("azc-grid-cell")
              .item(2).innerText !== "Direct";
          const scrapedGroupRoles = activateRoles.filter(activeGroupRoles);
          const scrapedDirectRoles = activateRoles.filter(
            (item) => !scrapedGroupRoles.includes(item)
          );
          return [scrapedGroupRoles, scrapedDirectRoles];
        }

        const [groupAssignments, directAssignments] = await gatherRoles();

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
          return roleText === roleTitle;
        };

        const activateRole = async (roleTitle, activateRoles) => {
          for (const role of activateRoles) {
            if (roleName(role, roleTitle)) {
              role.click();
              await applyReasonConfirmActivation();
            }
          }
        };

        if (groupAssignments.length !== 0 && type === "Group") {
          await activateRole(roleTitle, groupAssignments);
        }
        if (directAssignments.length !== 0 && type === "Direct") {
          await activateRole(roleTitle, directAssignments);
        }

        await sleep(1000);
        console.log("Successful activation of ", roleTitle);
      } catch (error) {
        console.log("Error activating ", roleTitle, error);
      }
    }
  }

  clientSideActivation(selectedRoles);
}
