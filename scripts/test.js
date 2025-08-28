// #portfolioForm ->

let allSkills = [];
let selectedSkills = [];
let projectSkills = {};
let workExperienceCount = 1;
let educationCount = 1;
let projectCount = 1;

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", async function () {
  await initializeApp();
});

async function initializeApp() {
  try {
    await loadSkillsFromServer();
    populateSkillsDropdown();
    populateProjectSkillsDropdown();
    setupEventListeners();
    setupExistingItemsNavigation();
    updateRemoveButtonsVisibility();
    console.log("Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize application:", error);
    await showError(
      "Initialization Error",
      "Unable to load skills data. Please refresh the page."
    );
  }
}

function setupEventListeners() {
  // Main skill select
  const mainSkillSelect = document.getElementById("skillSelect");
  if (mainSkillSelect) {
    mainSkillSelect.addEventListener("change", handleMainSkillSelectChange);
  }

  // Project skill selects (event delegation)
  document.addEventListener("change", handleProjectSkillSelectChange);

  // Date validation
  setupDateValidation();

  // Form submission
  const portfolioForm = document.getElementById("portfolioForm");
  if (portfolioForm) {
    portfolioForm.addEventListener("submit", handleFormSubmission);
  }

  // Current job/education checkboxes
  setupCurrentCheckboxes();
}

function setupExistingItemsNavigation() {
  setTimeout(() => {
    document
      .querySelectorAll(".work-item")
      .forEach((item) => addNavigationControls(item, "work"));
    document
      .querySelectorAll(".education-item")
      .forEach((item) => addNavigationControls(item, "education"));
    document
      .querySelectorAll(".project-item")
      .forEach((item) => addNavigationControls(item, "project"));
  }, 100);
}

// ==================== REMOVE BUTTONS VISIBILITY MANAGEMENT ====================

/* อัพเดทการแสดงผลของปุ่ม Remove ทั้งหมด  */

function updateRemoveButtonsVisibility() {
  updateSectionRemoveButtons("work", "#workExperienceContainer .work-item");
  updateSectionRemoveButtons("education", "#educationContainer .education-item");
  updateSectionRemoveButtons("project", "#projectsContainer .project-item");
}

/* อัพเดทการแสดงผลของปุ่ม Remove ในแต่ละส่วน */
function updateSectionRemoveButtons(sectionType, selector) {
  const items = document.querySelectorAll(selector);
  const shouldShowButtons = items.length > 1;

  items.forEach((item) => {
    const removeButton = item.querySelector(".btn-danger");
    if (removeButton) {
      removeButton.style.display = shouldShowButtons ? "inline-block" : "none";
    }
  });

  console.log(
    `${sectionType} section: ${items.length} items, remove buttons ${shouldShowButtons ? "visible" : "hidden"
    }`
  );
}

// ==================== NAVIGATION CONTROLS ====================
function addNavigationControls(element, type) {
  const itemHeader = element.querySelector(".item-header");
  if (!itemHeader) return;

  // Check if navigation controls already exist
  if (itemHeader.querySelector(".nav-controls")) {
    // Update existing navigation controls
    updateNavigationStates(type);
    return;
  }

  // Create navigation controls
  const navControls = document.createElement("div");
  navControls.className = "nav-controls";
  navControls.innerHTML = `
        <div class="nav-buttons">
            <button type="button" class="nav-btn nav-up" title="Move up">
                <i class="fas fa-chevron-up"></i>
            </button>
            <button type="button" class="nav-btn nav-down" title="Move down">
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
    `;

  // Insert navigation controls at the end of item header
  itemHeader.appendChild(navControls);

  // Add event listeners with proper binding
  const navUpBtn = navControls.querySelector(".nav-up");
  const navDownBtn = navControls.querySelector(".nav-down");

  if (navUpBtn) {
    navUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveItem(e.target.closest(".nav-btn"), type, "up");
    });
  }
  if (navDownBtn) {
    navDownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveItem(e.target.closest(".nav-btn"), type, "down");
    });
  }

  element.classList.add("navigable-item");

  // Update navigation states after adding controls
  updateNavigationStates(type);
}

function moveItem(buttonElement, type, direction) {
  const item = buttonElement.closest(
    ".work-item, .education-item, .project-item"
  );
  if (!item) {
    console.error("Could not find parent item for navigation button");
    return;
  }

  const container = item.parentElement;
  const items = Array.from(container.children);
  const currentIndex = items.indexOf(item);

  console.log(`Moving ${type} item from position ${currentIndex} ${direction}`);

  let targetIndex;
  if (direction === "up" && currentIndex > 0) {
    targetIndex = currentIndex - 1;
  } else if (direction === "down" && currentIndex < items.length - 1) {
    targetIndex = currentIndex + 1;
  } else {
    console.log("Cannot move item - already at boundary");
    return;
  }

  // Get target item
  const targetItem = items[targetIndex];

  // Perform the move
  if (direction === "up") {
    container.insertBefore(item, targetItem);
  } else {
    container.insertBefore(item, targetItem.nextSibling);
  }

  // Update item numbers and navigation states
  updateItemNumbers(type);
  updateNavigationStates(type);

  // Visual feedback with animation
  item.classList.add("moving-item");

  setTimeout(() => {
    item.classList.remove("moving-item");
  }, 300);
  console.log(`Successfully moved ${type} item to position ${targetIndex}`);
}

function updateNavigationStates(type) {
  const configs = {
    work: { selector: "#workExperienceContainer .work-item" },
    education: { selector: "#educationContainer .education-item" },
    project: { selector: "#projectsContainer .project-item" },
  };

  const config = configs[type];
  if (!config) return;

  const items = document.querySelectorAll(config.selector);

  items.forEach((item, index) => {
    const upBtn = item.querySelector(".nav-up");
    const downBtn = item.querySelector(".nav-down");

    if (upBtn) {
      upBtn.disabled = index === 0;
      upBtn.style.opacity = index === 0 ? "0.3" : "1";
      upBtn.style.cursor = index === 0 ? "not-allowed" : "pointer";
    }

    if (downBtn) {
      downBtn.disabled = index === items.length - 1;
      downBtn.style.opacity = index === items.length - 1 ? "0.3" : "1";
      downBtn.style.cursor = index === items.length - 1 ? "not-allowed" : "pointer";
    }
  });
}

function updateItemNumbers(type) {
  const configs = {
    work: {
      selector: "#workExperienceContainer .work-item",
      prefix: "Experience",
    },
    education: {
      selector: "#educationContainer .education-item",
      prefix: "Education",
    },
    project: {
      selector: "#projectsContainer .project-item",
      prefix: "Project",
    },
  };

  const config = configs[type];
  if (!config) return;

  const items = document.querySelectorAll(config.selector);
  items.forEach((item, index) => {
    const title = item.querySelector(".item-title");
    if (title) {
      title.textContent = `${config.prefix} #${index + 1}`;
    }
    item.dataset.index = index;

    // Update form field names
    updateItemFormFields(item, index, type);
  });
}

function updateItemFormFields(item, newIndex, type) {
  const fieldMappings = {
    work: "workExperience",
    education: "education",
    project: "projects",
  };

  const fieldName = fieldMappings[type];
  if (!fieldName) return;

  // Update all form elements
  const formElements = item.querySelectorAll("input, select, textarea");
  formElements.forEach((element) => {
    const currentName = element.getAttribute("name");
    if (currentName && currentName.includes(`${fieldName}[`)) {
      const newName = currentName.replace(
        new RegExp(`${fieldName}\\[\\d+\\]`),
        `${fieldName}[${newIndex}]`
      );
      element.setAttribute("name", newName);
    }

    const currentId = element.getAttribute("id");
    if (currentId && (currentId.includes(`${type}_`) || currentId.includes(`${fieldName}[`))) {
      const newId = currentId.replace(
        new RegExp(`(${type}_|${fieldName}\\[)\\d+`),
        `$1${newIndex}`
      );
      element.setAttribute("id", newId);
    }
  });


  // Update project-specific elements
  if (type === "project") {
    const imageInput = item.querySelector('input[type="file"]');
    const imageUploader = item.querySelector(".image-uploader");

    if (imageInput) {
      imageInput.id = `projectImage_${newIndex}`;
      imageInput.setAttribute(
        "onchange",
        `handleImageUpload(this, 'projectImageUploader_${newIndex}')`
      );
    }
    if (imageUploader) {
      imageUploader.id = `projectImageUploader_${newIndex}`;
    }

    // Update upload button onclick
    const uploadBtn = item.querySelector('button[onclick*="projectImage"]');
    if (uploadBtn) {
      uploadBtn.setAttribute(
        "onclick",
        `document.getElementById('projectImage_${newIndex}').click()`
      );
    }

    const skillSelect = item.querySelector(".project-skill-select");
    if (skillSelect) {
      skillSelect.dataset.project = newIndex;
    }

    const skillsContainer = item.querySelector(".project-skills-container");
    const skillsEmpty = item.querySelector(".project-skills-empty");

    if (skillsContainer) skillsContainer.dataset.project = newIndex;
    if (skillsEmpty) skillsEmpty.dataset.project = newIndex;

    // Update project skills input name
    const skillsInput = item.querySelector(".project-skills-input");
    if (skillsInput) {
      skillsInput.setAttribute("name", `projects[${newIndex}][skills]`);
    }
  }
}
// ==================== HELPER FUNCTIONS ====================
function addNavigationToNewItem(element, type) {
  addNavigationControls(element, type);
  updateNavigationStates(type);
}

function updateNavigationAfterRemoval(type) {
  updateNavigationStates(type);
  updateRemoveButtonsVisibility();
}

// ==================== SKILLS MANAGEMENT ====================
async function loadSkillsFromServer() {
  try {
    const response = await fetch("get-skills.php");

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format received from server");
    }

    allSkills = data;
    console.log(`Loaded ${allSkills.length} skills from server`);
    return data;
  } catch (error) {
    console.error("Failed to load skills from server:", error);
    await showError(
      "Error Loading Skills",
      `Unable to load skills data: ${error.message}`
    );
    allSkills = [];
    throw error;
  }
}

function populateSkillsDropdown() {
  const skillSelect = document.getElementById("skillSelect");
  if (!skillSelect) return;

  skillSelect.innerHTML = '<option value="">Choose a skill...</option>';

  allSkills.forEach((skill) => {
    const skillsID = parseInt(skill.id);
    if (!selectedSkills.includes(skillsID)) {
      const option = document.createElement("option");
      option.value = skillsID;
      option.textContent = skill.name;
      skillSelect.appendChild(option);
    }
  });

  const addBtn = document.getElementById("addSkillBtn");
  if (addBtn) {
    addBtn.disabled = true;
  }
}

function populateProjectSkillsDropdown() {
  const projectSelects = document.querySelectorAll(".project-skill-select");

  projectSelects.forEach((select) => {
    const projectIndex = parseInt(select.dataset.project);
    const projectSelectedSkills = projectSkills[projectIndex] || [];

    select.innerHTML = '<option value="">Choose a skill...</option>';

    allSkills.forEach((skill) => {
      const skillsID = parseInt(skill.id);
      if (!projectSelectedSkills.includes(skillsID)) {
        const option = document.createElement("option");
        option.value = skillsID;
        option.textContent = skill.name;
        select.appendChild(option);
      }
    });

    const addButton = select
      .closest(".input-group")
      .querySelector(".btn-success");
    if (addButton) {
      addButton.disabled = true;
    }
  });
}

/* เพิ่ม skill หลัก */
function addSkill() {
  const skillSelect = document.getElementById("skillSelect");
  if (!skillSelect) {
    console.error("Skill select element not found");
    return;
  }

  const skillsID = parseInt(skillSelect.value);
  console.log("Adding skill:", skillsID);

  if (skillsID && !isNaN(skillsID) && !selectedSkills.includes(skillsID)) {
    selectedSkills.push(skillsID);
    updateSkillsDisplay();
    populateSkillsDropdown();
    populateProjectSkillsDropdown();
    updateSelectedSkillsInput();
    console.log("Selected skills:", selectedSkills);
  } else {
    console.log("Invalid skill ID or skill already selected:", skillsID);
  }
}

/* ลบ skill หลัก */
function removeSkill(skillsID) {
  const parsedskillsID = parseInt(skillsID);
  selectedSkills = selectedSkills.filter(
    (id) => parseInt(id) !== parsedskillsID
  );
  updateSkillsDisplay();
  populateSkillsDropdown();
  populateProjectSkillsDropdown();
  updateSelectedSkillsInput();
}

/* อัพเดทการแสดงผล skills หลัก */
function updateSkillsDisplay() {
  const container = document.getElementById("selectedSkillsContainer");
  const emptyState = document.getElementById("emptySkillsState");
  const skillsList = document.getElementById("skillsList");
  const skillCount = document.getElementById("skillCount");

  if (!container || !emptyState || !skillsList || !skillCount) return;

  if (selectedSkills.length > 0) {
    container.style.display = "block";
    emptyState.style.display = "none";
    skillCount.textContent = selectedSkills.length;

    skillsList.innerHTML = "";
    selectedSkills.forEach((skillsID) => {
      const parsedskillsID = parseInt(skillsID);
      const skill = allSkills.find((s) => parseInt(s.id) === parsedskillsID);
      if (skill) {
        const skillTag = createSkillTag(
          skill,
          `removeSkill(${parsedskillsID})`
        );
        skillsList.appendChild(skillTag);
      }
    });
  } else {
    container.style.display = "none";
    emptyState.style.display = "block";
  }
}

/* อัพเดท hidden input สำหรับ selected skills */
function updateSelectedSkillsInput() {
  const selectedSkillsInput = document.getElementById("selectedSkillsInput");
  if (selectedSkillsInput) {
    selectedSkillsInput.value = selectedSkills.join(",");
  }
}

// ==================== PROJECT SKILLS MANAGEMENT ====================

/* เพิ่ม skill สำหรับ project */
function addProjectSkill(projectIndex) {
  const parsedProjectIndex = parseInt(projectIndex);
  const select = document.querySelector(
    `.project-skill-select[data-project="${parsedProjectIndex}"]`
  );

  if (!select) {
    console.error(
      `Project skill select not found for project ${parsedProjectIndex}`
    );
    return;
  }

  const skillsID = parseInt(select.value);
  console.log(`Adding skill ${skillsID} to project ${parsedProjectIndex}`);

  if (skillsID && !isNaN(skillsID)) {
    if (!projectSkills[parsedProjectIndex]) {
      projectSkills[parsedProjectIndex] = [];
    }

    if (!projectSkills[parsedProjectIndex].includes(skillsID)) {
      projectSkills[parsedProjectIndex].push(skillsID);
      updateProjectSkillsDisplay(parsedProjectIndex);
      populateProjectSkillsDropdown();
      updateProjectSkillsInput(parsedProjectIndex);
      console.log(
        `Project ${parsedProjectIndex} skills:`,
        projectSkills[parsedProjectIndex]
      );
    }
  }
}

/* ลบ skill จาก project */
function removeProjectSkill(projectIndex, skillsID) {
  const parsedProjectIndex = parseInt(projectIndex);
  const parsedskillsID = parseInt(skillsID);

  if (projectSkills[parsedProjectIndex]) {
    projectSkills[parsedProjectIndex] = projectSkills[
      parsedProjectIndex
    ].filter((id) => parseInt(id) !== parsedskillsID);
    updateProjectSkillsDisplay(parsedProjectIndex);
    populateProjectSkillsDropdown();
    updateProjectSkillsInput(parsedProjectIndex);
  }
}

/* อัพเดทการแสดงผล skills ของ project */
function updateProjectSkillsDisplay(projectIndex) {
  const parsedProjectIndex = parseInt(projectIndex);
  const container = document.querySelector(
    `.project-skills-container[data-project="${parsedProjectIndex}"]`
  );
  const emptyState = document.querySelector(
    `.project-skills-empty[data-project="${parsedProjectIndex}"]`
  );

  if (!container || !emptyState) return;

  const skillsList = container.querySelector(".project-skills-list");
  const skillCount = container.querySelector(".project-skill-count");
  const skills = projectSkills[parsedProjectIndex] || [];

  if (skills.length > 0) {
    container.style.display = "block";
    emptyState.style.display = "none";

    if (skillCount) skillCount.textContent = skills.length;

    if (skillsList) {
      skillsList.innerHTML = "";
      skills.forEach((skillsID) => {
        const parsedskillsID = parseInt(skillsID);
        const skill = allSkills.find((s) => parseInt(s.id) === parsedskillsID);
        if (skill) {
          const skillTag = createSkillTag(
            skill,
            `removeProjectSkill(${parsedProjectIndex}, ${parsedskillsID})`
          );
          skillsList.appendChild(skillTag);
        }
      });
    }
  } else {
    container.style.display = "none";
    emptyState.style.display = "block";
  }
}

/* อัพเดท hidden input สำหรับ project skills */
function updateProjectSkillsInput(projectIndex) {
  const input = document.querySelector(
    `input[name="projects[${projectIndex}][skills]"]`
  );
  if (input && projectSkills[projectIndex]) {
    input.value = projectSkills[projectIndex].join(",");
  }
}

/* สร้าง skill tag element */
function createSkillTag(skill, onClickAction) {
  const skillTag = document.createElement("div");
  skillTag.className = "skill-tag";
  skillTag.innerHTML = `
        <span>${skill.name}</span>
        <button type="button" class="skill-remove" onclick="${onClickAction}">×</button>
    `;
  return skillTag;
}

// ==================== EVENT HANDLERS ====================

function handleMainSkillSelectChange(event) {
  const addBtn = document.getElementById("addSkillBtn");
  if (addBtn) {
    addBtn.disabled = event.target.value === "" || !event.target.value;
    console.log(
      "Main skill select changed:",
      event.target.value,
      "Button disabled:",
      addBtn.disabled
    ); // True = ไม่ได้เพิ่ม skill ,False = เพิ่ม skill มาแล้ว
  }
}

function handleProjectSkillSelectChange(event) {
  if (event.target.classList.contains("project-skill-select")) {
    const projectIndex = parseInt(event.target.dataset.project);
    const addButton = event.target
      .closest(".input-group")
      .querySelector(".btn-success");
    if (addButton) {
      addButton.disabled = event.target.value === "" || !event.target.value;
      console.log(
        `Project ${projectIndex} skill select changed:`,
        event.target.value,
        "Button disabled:",
        addButton.disabled
      );
    }
  }
}

/* จัดการการส่งฟอร์ม */
async function handleFormSubmission(event) {
  event.preventDefault();

  try {
    // ตรวจสอบก่อนส่งข้อมูล
    if (!validateFormBeforeSubmit()) {
      return; // ถ้าตรวจสอบไม่ผ่านให้หยุด
    }

    // แสดง loading
    Swal.fire({
      title: "Saving data...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const formData = new FormData(event.target);

    // Debug: แสดงข้อมูลที่จะส่ง
    console.log("Form data being sent:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch("insert.php", {
      method: "POST",
      body: formData,
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      // ถ้า response ไม่ใช่ JSON ให้ใช้ text
      const textResult = await response.text();
      console.error("Invalid JSON response:", textResult);
      throw new Error("Server returned invalid response");
    }

    Swal.close();

    if (result.success) {
      await showSuccess(
        "Success!",
        result.message || "Data saved successfully."
      );
      // เปลี่ยนเส้นทางหลังจากบันทึกสำเร็จ
      if (result.userId) {
        // window.location.href = `portfolio.php?id=${result.userId}`;
        console.log("Portfolio created with ID:", result.userId);
      }
    } else {
      await showError(
        "An error occurred.",
        result.message || "Unable to save data."
      );
    }
  } catch (error) {
    console.error("Form submission error:", error);
    Swal.close();
    await showError(
      "An error occurred.",
      "Unable to send data. Please check your internet connection."
    );
  }
}

/* ตรวจสอบข้อมูลก่อนส่งฟอร์ม*/
function validateFormBeforeSubmit() {
  // ตรวจสอบรูปภาพที่จำเป็น
  const requiredImages = [
    { id: "profileImage", name: "Profile Image" },
    { id: "coverImage", name: "Cover Image" },
  ];

  for (let image of requiredImages) {
    const fileInput = document.getElementById(image.id);
    if (!fileInput || !fileInput.files.length) {
      showError("Missing information.", `Please upload ${image.name}`);
      // เลื่อนไปที่ input ที่ขาด
      if (fileInput) {
        fileInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
  }

  // ตรวจสอบรูปภาพ project
  const projectItems = document.querySelectorAll(".project-item");
  for (let i = 0; i < projectItems.length; i++) {
    const item = projectItems[i];
    const titleInput = item.querySelector(`input[name*="[projectTitle]"]`);
    const imageInput = item.querySelector(`input[name*="[projectImage]"]`);

    if (titleInput && titleInput.value.trim()) {
      if (!imageInput || !imageInput.files.length) {
        showError(
          "Missing information.",
          `Please upload images for the project: ${titleInput.value}`
        );

        // เลื่อนไปที่ project item ที่มีปัญหา
        item.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
    }
  }

  // ตรวจสอบ date ranges ทั้งหมด
  const dateErrors = validateAllDateRanges();
  if (dateErrors.length > 0) {
    showError("Invalid date", dateErrors[0]);
    return false;
  }

  // ตรวจสอบข้อมูลพื้นฐาน
  const requiredFields = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "position", label: "Professional Title" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
    { name: "facebook", label: "facebook" },
    { name: "facebookUrl", label: "facebook URL" },
    { name: "introContent", label: "About Me" },
    { name: "skillsContent", label: "Skills Description" },
  ];

  for (let field of requiredFields) {
    const input = document.querySelector(`[name="${field.name}"]`);
    if (!input || !input.value.trim()) {
      showError("Missing information", `Please Fill ${field.label}`);
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
  }

  // ตรวจสอบ email format
  const emailInput = document.querySelector('[name="email"]');
  if (emailInput && !isValidEmail(emailInput.value)) {
    showError("Invalid data", "Please enter a valid email address");
    emailInput.focus();
    return false;
  }

  return true; // ผ่านการตรวจสอบทั้งหมด
}

/* ตรวจสอบ date ranges ทั้งหมดในฟอร์ม */
function validateAllDateRanges() {
  const errors = [];

  // ตรวจสอบ work experience
  const workItems = document.querySelectorAll(".work-item");
  workItems.forEach((item, index) => {
    const startDate = item.querySelector('input[name*="[startDate]"]');
    const endDate = item.querySelector('input[name*="[endDate]"]');
    const currentCheckbox = item.querySelector('input[name*="[current]"]');

    if (startDate && endDate && startDate.value && endDate.value && !currentCheckbox?.checked) {
      if (!isValidDateRange(startDate.value, endDate.value)) {
        errors.push(
          `Start date for work experience entry #${index + 1
          } must be before the end date.`
        );
      }
    }
  });

  // ตรวจสอบ education
  const educationItems = document.querySelectorAll(".education-item");
  educationItems.forEach((item, index) => {
    const startDate = item.querySelector('input[name*="[startDate]"]');
    const endDate = item.querySelector('input[name*="[endDate]"]');
    const currentCheckbox = item.querySelector('input[name*="[isCurrent]"]');

    if (startDate && endDate && startDate.value && endDate.value && !currentCheckbox?.checked) {
      if (!isValidDateRange(startDate.value, endDate.value)) {
        errors.push(
          `Start date for education entry #${index + 1
          } must be before the end date.`
        );
      }
    }
  });

  return errors;
}

// ==================== DATE FUNCTIONALITY ====================

function setupCurrentCheckboxes() {
  document.addEventListener("change", function (e) {
    if (
      e.target.type === "checkbox" &&
      (e.target.name.includes("[current]") ||
        e.target.name.includes("[isCurrent]"))
    ) {
      const container = e.target.closest(".work-item, .education-item");
      if (container) {
        const endDateInput = container.querySelector(
          'input[name*="[endDate]"]'
        );
        if (endDateInput) {
          if (e.target.checked) {
            endDateInput.value = "";
            endDateInput.disabled = true;
          } else {
            endDateInput.disabled = false;
          }
        }
      }
    }
  });
}

function setupDateValidation() {
  document.addEventListener("input", function (e) {
    if (e.target.type === "date") {
      e.target.classList.remove("input-error");

      const container = e.target.closest(".work-item, .education-item");
      if (container) {
        setTimeout(() => validateDateRangeInContainer(container), 100);
      }
    }
  });
}

function validateDateRangeInContainer(container) {
  const startDateInput = container.querySelector('input[name*="[startDate]"]');
  const endDateInput = container.querySelector('input[name*="[endDate]"]');

  if (
    startDateInput &&
    endDateInput &&
    startDateInput.value &&
    endDateInput.value
  ) {
    if (
      !isValidDate(startDateInput.value) ||
      !isValidDate(endDateInput.value)
    ) {
      showError("Invalid Date", "Please enter a valid date.");
      startDateInput.classList.add("input-error");
      endDateInput.classList.add("input-error");
      return false;
    }

    if (!isValidDateRange(startDateInput.value, endDateInput.value)) {
      let sectionName = "This item";
      if (container.classList.contains("work-item")) {
        sectionName = "Work experience";
      } else if (container.classList.contains("education-item")) {
        sectionName = "Education";
      }

      showError(
        "Invalid Date Range",
        `Start date of ${sectionName} must be before the end date.`
      );

      startDateInput.classList.add("input-error");
      endDateInput.classList.add("input-error");
      return false;
    }
  }
  return true;
}

// ==================== IMAGE HANDLING ====================

/* จัดการการอัพโหลดรูปภาพ */
function handleImageUpload(input, uploaderId) {
  const uploader = document.getElementById(uploaderId);
  const file = input.files[0];

  if (!file) return;

  // ตรวจสอบประเภทและขนาดไฟล์
  if (!isValidImageFile(file)) {
    showError(
      "Invalid file",
      "Please select an image file (JPG, PNG, GIF) no larger than 10 MB."
    );
    input.value = ""; // ล้างการเลือกไฟล์
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    uploader.innerHTML = createImagePreviewHTML(
      e.target.result,
      input.id,
      uploaderId,
      file.name
    );
  };
  reader.onerror = function () {
    showError("An error occurred.", "Cannot read file.");
    input.value = "";
  };
  reader.readAsDataURL(file);
}

/* ลบรูปภาพ */
function removeImage(uploaderId, inputId) {
  const uploader = document.getElementById(uploaderId);
  const input = document.getElementById(inputId);

  if (input) input.value = "";
  if (uploader) {
    uploader.innerHTML = createImageUploaderHTML(inputId);
  }
}

/**
 * สร้าง HTML สำหรับแสดงตัวอย่างรูปภาพ
 */
function createImagePreviewHTML(imageSrc, inputId, uploaderId, fileName = "") {
  return `
        <div class="image-preview">
            <img src="${imageSrc}" alt="Preview" style="max-width: 100%; max-height: 160px; border-radius: 8px; object-fit: cover;">
            ${fileName
      ? `<p style="font-size: 12px; color: #666; margin-top: 8px; word-break: break-all;">${fileName}</p>`
      : ""
    }
        </div>
        <div style="display: flex; justify-content: center; gap: 8px; margin-top: 12px;">
            <button type="button" class="btn btn-primary" onclick="document.getElementById('${inputId}').click()">
                Change Image
            </button>
            <button type="button" class="btn btn-danger" onclick="removeImage('${uploaderId}', '${inputId}')">
                Remove
            </button>
        </div>
    `;
}

/* สร้าง HTML สำหรับ image uploader */
function createImageUploaderHTML(inputId) {
  return `
        <div class="upload-placeholder">
            <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('${inputId}').click()">
                Upload Image
            </button>
            <p class="upload-hint">PNG, JPG, GIF up to 10MB</p>
        </div>
    `;
}

// ==================== WORK EXPERIENCE MANAGEMENT ====================

/* เพิ่มประสบการณ์การทำงาน */
function addWorkExperience() {
  const container = document.getElementById("workExperienceContainer");
  if (!container) return;

  const newItem = createWorkExperienceItem(workExperienceCount);
  container.appendChild(newItem);
  addNavigationControls(newItem, "work");
  updateNavigationStates("work");
  workExperienceCount++;

  // อัพเดทการแสดงผลปุ่ม Remove
  updateRemoveButtonsVisibility();
}

/* สร้าง Work Experience Item */
function createWorkExperienceItem(index) {
  const item = document.createElement("div");
  item.className = "work-item";
  item.dataset.index = index;
  item.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">Experience #${index + 1}</h3>
            <div class="nav-controls">
                <div class="nav-buttons">
                    <button type="button" class="nav-btn nav-up" title="Move up">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button type="button" class="nav-btn nav-down" title="Move down">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                 </div>
            </div>
        </div>

        <div class="grid grid-cols-2">
            <div class="form-group">
                <label class="form-label required">Company Name</label>
                <input type="text" name="workExperience[${index}][companyName]" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Position</label>
                <input type="text" name="workExperience[${index}][position]" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Employment Type</label>
                <select name="workExperience[${index}][employeeType]" class="form-select" required>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>
            
            <div class="form-group">
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label required">Start Date</label>
                        <input type="date" name="workExperience[${index}][startDate]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" name="workExperience[${index}][endDate]" class="form-input">
                    </div>
                </div>
                <div class="form-group mt-2">
                    <div class="flex items-center">
                        <input type="checkbox" name="workExperience[${index}][current]" value="1" class="form-checkbox">
                        <label class="ml-2">I currently work here</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group col-span-2">
                <label class="form-label required">Job Description</label>
                <textarea name="workExperience[${index}][positionDescription]" class="form-textarea" rows="3" required></textarea>
            </div>
            
            <div class="form-group col-span-2">
                <label class="form-label">Remark</label>
                <textarea name="workExperience[${index}][workExperienceRemarks]" class="form-textarea" rows="3"></textarea>
            </div>
        </div>

         <div class="button-container">
            <button type="button" class="btn btn-danger" onclick="removeWorkExperience(${index})" style="display: none;">Remove</button>
        </div>
    `;
  return item;
}

/* ลบประสบการณ์การทำงาน */
function removeWorkExperience(index) {
  const parsedIndex = parseInt(index);
  const item = document.querySelector(
    `.work-item[data-index="${parsedIndex}"]`
  );
  if (item) {
    item.remove();
    // อัพเดทหมายเลขของ items ที่เหลือ
    updateItemNumbers("work");
    updateNavigationStates("work");
    // อัพเดทการแสดงผลปุ่ม Remove
    updateRemoveButtonsVisibility();
  }
}

// ==================== EDUCATION MANAGEMENT ====================

/* เพิ่มข้อมูลการศึกษา */
function addEducation() {
  const container = document.getElementById("educationContainer");
  if (!container) return;

  const newItem = createEducationItem(educationCount);
  container.appendChild(newItem);
  addNavigationControls(newItem, "education");
  updateNavigationStates("education");
  educationCount++;

  // อัพเดทการแสดงผลปุ่ม Remove
  updateRemoveButtonsVisibility();
}

/* สร้าง Education Item */
function createEducationItem(index) {
  const item = document.createElement("div");
  item.className = "education-item";
  item.dataset.index = index;
  item.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">Education #${index + 1}</h3>
            <div class="nav-controls">
                <div class="nav-buttons">
                    <button type="button" class="nav-btn nav-up" title="Move up">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button type="button" class="nav-btn nav-down" title="Move down">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-2">
            <div class="form-group">
                <label class="form-label required">Institution Name</label>
                <input type="text" name="education[${index}][educationName]" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Degree</label>
                <input type="text" name="education[${index}][degree]" class="form-input" placeholder="e.g., Bachelor's, Master's" required>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Faculty</label>
                <input type="text" name="education[${index}][facultyName]" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label required">Major</label>
                <input type="text" name="education[${index}][majorName]" class="form-input" required>
            </div>
            
            <div class="form-group col-span-2">
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label required">Start Date</label>
                        <input type="date" name="education[${index}][startDate]" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" name="education[${index}][endDate]" class="form-input">
                    </div>
                </div>
                <div class="form-group mt-2">
                    <div class="flex items-center">
                        <input type="checkbox" name="education[${index}][isCurrent]" value="1" class="form-checkbox">
                        <label class="ml-2">Currently studying here</label>
                    </div>
                </div>
            </div>

            <div class="form-group col-span-2">
                <label class="form-label">Remark</label>
                <textarea name="education[${index}][educationRemarks]" class="form-textarea" rows="3"></textarea>
            </div>
        </div>

        <div class="button-container">
            <button type="button" class="btn btn-danger" onclick="removeEducation(${index})" style="display: none;">Remove</button>
        </div>
        
    `;
  return item;
}

/* ลบข้อมูลการศึกษา */
function removeEducation(index) {
  const parsedIndex = parseInt(index);
  const item = document.querySelector(
    `.education-item[data-index="${parsedIndex}"]`
  );
  if (item) {
    item.remove();
    // อัพเดทหมายเลขของ items ที่เหลือ
    updateItemNumbers("education");
    updateNavigationStates("education");
    // อัพเดทการแสดงผลปุ่ม Remove
    updateRemoveButtonsVisibility();
  }
}

// ==================== PROJECT MANAGEMENT ====================
/* เพิ่มโปรเจค */
function addProject() {
  const container = document.getElementById("projectsContainer");
  if (!container) return;

  const newItem = createProjectItem(projectCount);
  container.appendChild(newItem);
  addNavigationControls(newItem, "project");
  populateProjectSkillsDropdown();
  updateNavigationStates("project");
  projectCount++;

  // อัพเดทการแสดงผลปุ่ม Remove
  updateRemoveButtonsVisibility();
}

/* สร้าง Project Item */
function createProjectItem(index) {
  const item = document.createElement("div");
  item.className = "project-item";
  item.dataset.index = index;
  item.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">Project #${index + 1}</h3>
            <div class="nav-controls">
                <div class="nav-buttons">
                    <button type="button" class="nav-btn nav-up" title="Move up">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button type="button" class="nav-btn nav-down" title="Move down">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <label class="form-label required">Project Title</label>
            <input type="text" name="projects[${index}][projectTitle]" class="form-input" required>
        </div>
        
        <div class="form-group">
            <label class="form-label required">Project Image</label>
            <div class="image-uploader" id="projectImageUploader_${index}">
                <div class="upload-placeholder">
                    <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <button type="button" class="btn btn-primary" onclick="document.getElementById('projectImage_${index}').click()">
                        Upload Image
                    </button>
                    <p>PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            <input type="file" id="projectImage_${index}" name="projects[${index}][projectImage]" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'projectImageUploader_${index}')" required>
        </div>
        
        <div class="form-group">
            <label class="form-label required">Project Description</label>
            <textarea name="projects[${index}][keyPoint]" class="form-textarea" rows="3" placeholder="Describe the project, your role, and key achievements..." required></textarea>
        </div>
        
        <div class="skills">
            <h4>Technologies Used in This Project</h4>
            
            <div class="selector">
                <div class="input-group">
                    <div class="form-group">
                        <label class="form-label required">Select Skill</label>
                        <select class="form-select project-skill-select" data-project="${index}">
                            <option value="">Choose a skill...</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-success" onclick="addProjectSkill(${index})" disabled>Add Skill</button>
                </div>
            </div>

            <div class="selected-skills project-skills-container" data-project="${index}">
                <h5>Selected Skills (<span class="project-skill-count">0</span>)</h5>
                <div class="skills-list project-skills-list"></div>
            </div>
            
            <div class="empty-state project-skills-empty" data-project="${index}">
                No skills selected yet. Use the dropdown above to add skills.
            </div>
            
            <input type="hidden" name="projects[${index}][skills]" class="project-skills-input">
        </div>

         <div class="button-container">
            <button type="button" class="btn btn-danger" onclick="removeProject(${index})" style="display: none;">Remove</button>
        </div>
    `;
  return item;
}

/* ลบโปรเจค */
function removeProject(index) {
  const parsedIndex = parseInt(index);
  const item = document.querySelector(
    `.project-item[data-index="${parsedIndex}"]`
  );
  if (item) {
    delete projectSkills[parsedIndex];
    item.remove();
    // อัพเดทหมายเลขของ items ที่เหลือ
    updateItemNumbers("project");
    updateNavigationStates("project");
    // อัพเดท dropdown ของ projects อื่น
    populateProjectSkillsDropdown();
    // อัพเดทการแสดงผลปุ่ม Remove
    updateRemoveButtonsVisibility();
  }
}

// ==================== UTILITY FUNCTIONS ====================

/* แสดงข้อความแจ้งเตือนแบบ success */
async function showSuccess(title, text) {
  return await Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonText: "Confirmed",
    confirmButtonColor: "#10b981",
  });
}

/**
 * แสดงข้อความแจ้งเตือนแบบ error
 */
async function showError(title, text) {
  return await Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonText: "Confirmed",
    confirmButtonColor: "#ef4444",
  });
}

/* แสดงข้อความแจ้งเตือนแบบ warning */
async function showWarning(title, text) {
  return await Swal.fire({
    icon: "warning",
    title: title,
    text: text,
    confirmButtonText: "OK",
    confirmButtonColor: "#f59e0b",
  });
}

/* แสดงข้อความแจ้งเตือนแบบ confirmation */
async function showConfirmation(
  title,
  text,
  confirmText = "OK",
  cancelText = "Cancel"
) {
  return await Swal.fire({
    icon: "question",
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#3b82f6",
    cancelButtonColor: "#6b7280",
  });
}

// ==================== VALIDATION FUNCTIONS ====================

/**
 * ตรวจสอบความถูกต้องของ email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ตรวจสอบความถูกต้องของเบอร์โทรศัพท์
 */
function isValidPhoneNumber(phone) {
  const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * ตรวจสอบว่าข้อมูลไม่เป็นค่าว่าง
 */
function isNotEmpty(value) {
  return value && value.toString().trim() !== "";
}

/**
 * ตรวจสอบความยาวของข้อความ
 */
function isValidLength(text, minLength = 0, maxLength = Infinity) {
  const length = text ? text.length : 0;
  return length >= minLength && length <= maxLength;
}

/**
 * ตรวจสอบว่าไฟล์เป็นรูปภาพหรือไม่
 */
function isValidImageFile(file) {
  if (!file) return false;

  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return validTypes.includes(file.type) && file.size <= maxSize;
}

/**
 * ตรวจสอบความถูกต้องของวันที่
 */
function isValidDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * ตรวจสอบว่าวันที่เริ่มต้นมาก่อนวันที่สิ้นสุด
 */
function isValidDateRange(startDate, endDate) {
  if (!startDate || !endDate) return true; // อนุญาตให้เป็นค่าว่างได้

  const start = new Date(startDate);
  const end = new Date(endDate);

  return start <= end;
}

/**
 * ตรวจสอบว่า URL ถูกต้องหรือไม่
 */
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Sanitize input string
 */
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "");
}

// ==================== DEBUG & HELPER FUNCTIONS ====================

/**
 * ดีบัก: แสดงข้อมูลใน console
 */
function debugLog(message, data = null) {
  if (console && console.log) {
    if (data) {
      console.log(`[DEBUG] ${message}`, data);
    } else {
      console.log(`[DEBUG] ${message}`);
    }
  }
}

/**
 * ดีบัก: แสดงข้อผิดพลาดใน console
 */
function debugError(message, error = null) {
  if (console && console.error) {
    if (error) {
      console.error(`[ERROR] ${message}`, error);
    } else {
      console.error(`[ERROR] ${message}`);
    }
  }
}

/**
 * รีเซ็ตฟอร์มทั้งหมด (สำหรับการทดสอบ)
 */
function resetForm() {
  if (
    confirm(
      "คุณต้องการรีเซ็ตฟอร์มทั้งหมดใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
    )
  ) {
    document.getElementById("portfolioForm").reset();
    selectedSkills = [];
    projectSkills = {};
    updateSkillsDisplay();
    populateSkillsDropdown();
    populateProjectSkillsDropdown();

    // ลบ items ที่เพิ่มเข้ามา (เหลือแค่ item แรก)
    document
      .querySelectorAll(".work-item:not(:first-child)")
      .forEach((item) => item.remove());
    document
      .querySelectorAll(".education-item:not(:first-child)")
      .forEach((item) => item.remove());
    document
      .querySelectorAll(".project-item:not(:first-child)")
      .forEach((item) => item.remove());

    // รีเซ็ต counters
    workExperienceCount = 1;
    educationCount = 1;
    projectCount = 1;

    // อัพเดทการแสดงผลปุ่ม Remove
    updateRemoveButtonsVisibility();
  }
}
