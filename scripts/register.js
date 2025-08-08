/**
 * Portfolio Management System
 * ระบบจัดการข้อมูลส่วนตัวและประวัติการทำงาน
 */

// ==================== GLOBAL VARIABLES ====================
let allSkills = [];
let selectedSkills = [];
let projectSkills = {};
let workExperienceCount = 1;
let educationCount = 1;
let projectCount = 1;
let draggedElement = null;
let draggedType = null; 

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async function () {
    await initializeApp();
});

/**
 * เริ่มต้นระบบหลังจากโหลดหน้าเว็บเสร็จ
 */
async function initializeApp() {
    try {
        await loadSkillsFromServer();
        populateSkillsDropdown();
        populateProjectSkillsDropdown();
        setupEventListeners();
        setupExistingItemsSortable();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        await showError('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูล skills ได้ กรุณาลองใหม่');
    }
}

/**
 * ตั้งค่า Event Listeners ต่างๆ
 */
function setupEventListeners() {
    // Main skill select
    const mainSkillSelect = document.getElementById('skillSelect');
    if (mainSkillSelect) {
        mainSkillSelect.addEventListener('change', handleMainSkillSelectChange);
    }

    // Project skill selects (delegation)
    document.addEventListener('change', handleProjectSkillSelectChange);

    // Sortable containers
    setupSortableEventListeners();

    // Form submission
    const portfolioForm = document.getElementById('portfolioForm');
    if (portfolioForm) {
        portfolioForm.addEventListener('submit', handleFormSubmission);
    }
}

/**
 * ทำให้ existing items เป็น sortable หลังจากโหลดเสร็จ
 */
function setupExistingItemsSortable() {
    setTimeout(() => {
        document.querySelectorAll('.work-item').forEach(item => makeSortableItem(item, 'work'));
        document.querySelectorAll('.education-item').forEach(item => makeSortableItem(item, 'education'));
        document.querySelectorAll('.project-item').forEach(item => makeSortableItem(item, 'project'));
    }, 100);
}

// ==================== SKILLS MANAGEMENT ====================

/**
 * โหลดข้อมูล skills จาก server
 */
async function loadSkillsFromServer() {
    try {
        const response = await fetch('get-skills.php');
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        if (!Array.isArray(data)) {
            throw new Error(data.error || 'Invalid data format received from server');
        }

        allSkills = data;
        console.log(`Loaded ${allSkills.length} skills from server`);
        return data;

    } catch (error) {
        console.error("Failed to load skills from server:", error);
        await showError('เกิดข้อผิดพลาด', `ไม่สามารถโหลดข้อมูลสกิลได้: ${error.message}`);
        allSkills = [];
        throw error;
    }
}

/**
 * เติมข้อมูลใน main skills dropdown
 */
function populateSkillsDropdown() {
    const skillSelect = document.getElementById('skillSelect');
    if (!skillSelect) return;

    skillSelect.innerHTML = '<option value="">Choose a skill...</option>';

    allSkills.forEach(skill => {
        const skillId = parseInt(skill.id);
        if (!selectedSkills.includes(skillId)) {
            const option = document.createElement('option');
            option.value = skillId;
            option.textContent = skill.name;
            skillSelect.appendChild(option);
        }
    });

    // Reset button state
    const addBtn = document.getElementById('addSkillBtn');
    if (addBtn) {
        addBtn.disabled = true;
    }
}

/**
 * เติมข้อมูลใน project skills dropdown
 */
function populateProjectSkillsDropdown() {
    const projectSelects = document.querySelectorAll('.project-skill-select');
    
    projectSelects.forEach(select => {
        const projectIndex = parseInt(select.dataset.project);
        const projectSelectedSkills = projectSkills[projectIndex] || [];

        select.innerHTML = '<option value="">Choose a skill...</option>';
        
        allSkills.forEach(skill => {
            const skillId = parseInt(skill.id);
            if (!projectSelectedSkills.includes(skillId)) {
                const option = document.createElement('option');
                option.value = skillId;
                option.textContent = skill.name;
                select.appendChild(option);
            }
        });

        // Reset button state
        const addButton = select.closest('.input-group').querySelector('.btn-success');
        if (addButton) {
            addButton.disabled = true;
        }
    });
}

/**
 * เพิ่ม skill หลัก
 */
function addSkill() {
    const skillSelect = document.getElementById('skillSelect');
    if (!skillSelect) {
        console.error('Skill select element not found');
        return;
    }

    const skillId = parseInt(skillSelect.value);
    console.log('Adding skill:', skillId);

    if (skillId && !isNaN(skillId) && !selectedSkills.includes(skillId)) {
        selectedSkills.push(skillId);
        updateSkillsDisplay();
        populateSkillsDropdown();
        populateProjectSkillsDropdown();
        updateSelectedSkillsInput();
        console.log('Selected skills:', selectedSkills);
    } else {
        console.log('Invalid skill ID or skill already selected:', skillId);
    }
}

/**
 * ลบ skill หลัก
 */
function removeSkill(skillId) {
    const parsedSkillId = parseInt(skillId);
    selectedSkills = selectedSkills.filter(id => parseInt(id) !== parsedSkillId);
    updateSkillsDisplay();
    populateSkillsDropdown();
    populateProjectSkillsDropdown();
    updateSelectedSkillsInput();
}

/**
 * อัพเดทการแสดงผล skills หลัก
 */
function updateSkillsDisplay() {
    const container = document.getElementById('selectedSkillsContainer');
    const emptyState = document.getElementById('emptySkillsState');
    const skillsList = document.getElementById('skillsList');
    const skillCount = document.getElementById('skillCount');

    if (!container || !emptyState || !skillsList || !skillCount) return;

    if (selectedSkills.length > 0) {
        container.style.display = 'block';
        emptyState.style.display = 'none';
        skillCount.textContent = selectedSkills.length;

        skillsList.innerHTML = '';
        selectedSkills.forEach(skillId => {
            const parsedSkillId = parseInt(skillId);
            const skill = allSkills.find(s => parseInt(s.id) === parsedSkillId);
            if (skill) {
                const skillTag = createSkillTag(skill, `removeSkill(${parsedSkillId})`);
                skillsList.appendChild(skillTag);
            }
        });
    } else {
        container.style.display = 'none';
        emptyState.style.display = 'block';
    }
}

/**
 * อัพเดท hidden input สำหรับ selected skills
 */
function updateSelectedSkillsInput() {
    const selectedSkillsInput = document.getElementById('selectedSkillsInput');
    if (selectedSkillsInput) {
        selectedSkillsInput.value = selectedSkills.join(',');
    }
}

// ==================== PROJECT SKILLS MANAGEMENT ====================

/**
 * เพิ่ม skill สำหรับ project
 */
function addProjectSkill(projectIndex) {
    const parsedProjectIndex = parseInt(projectIndex);
    const select = document.querySelector(`.project-skill-select[data-project="${parsedProjectIndex}"]`);
    
    if (!select) {
        console.error(`Project skill select not found for project ${parsedProjectIndex}`);
        return;
    }

    const skillId = parseInt(select.value);
    console.log(`Adding skill ${skillId} to project ${parsedProjectIndex}`);

    if (skillId && !isNaN(skillId)) {
        if (!projectSkills[parsedProjectIndex]) {
            projectSkills[parsedProjectIndex] = [];
        }

        if (!projectSkills[parsedProjectIndex].includes(skillId)) {
            projectSkills[parsedProjectIndex].push(skillId);
            updateProjectSkillsDisplay(parsedProjectIndex);
            populateProjectSkillsDropdown();
            updateProjectSkillsInput(parsedProjectIndex);
            console.log(`Project ${parsedProjectIndex} skills:`, projectSkills[parsedProjectIndex]);
        }
    }
}

/**
 * ลบ skill จาก project
 */
function removeProjectSkill(projectIndex, skillId) {
    const parsedProjectIndex = parseInt(projectIndex);
    const parsedSkillId = parseInt(skillId);

    if (projectSkills[parsedProjectIndex]) {
        projectSkills[parsedProjectIndex] = projectSkills[parsedProjectIndex]
            .filter(id => parseInt(id) !== parsedSkillId);
        updateProjectSkillsDisplay(parsedProjectIndex);
        populateProjectSkillsDropdown();
        updateProjectSkillsInput(parsedProjectIndex);
    }
}

/**
 * อัพเดทการแสดงผล skills ของ project
 */
function updateProjectSkillsDisplay(projectIndex) {
    const parsedProjectIndex = parseInt(projectIndex);
    const container = document.querySelector(`.project-skills-container[data-project="${parsedProjectIndex}"]`);
    const emptyState = document.querySelector(`.project-skills-empty[data-project="${parsedProjectIndex}"]`);

    if (!container || !emptyState) return;

    const skillsList = container.querySelector('.project-skills-list');
    const skillCount = container.querySelector('.project-skill-count');
    const skills = projectSkills[parsedProjectIndex] || [];

    if (skills.length > 0) {
        container.style.display = 'block';
        emptyState.style.display = 'none';

        if (skillCount) skillCount.textContent = skills.length;

        if (skillsList) {
            skillsList.innerHTML = '';
            skills.forEach(skillId => {
                const parsedSkillId = parseInt(skillId);
                const skill = allSkills.find(s => parseInt(s.id) === parsedSkillId);
                if (skill) {
                    const skillTag = createSkillTag(
                        skill, 
                        `removeProjectSkill(${parsedProjectIndex}, ${parsedSkillId})`
                    );
                    skillsList.appendChild(skillTag);
                }
            });
        }
    } else {
        container.style.display = 'none';
        emptyState.style.display = 'block';
    }
}

/**
 * อัพเดท hidden input สำหรับ project skills
 */
function updateProjectSkillsInput(projectIndex) {
    const input = document.querySelector(`input[name="projects[${projectIndex}][skills]"]`);
    if (input) {
        input.value = projectSkills[projectIndex].join(',');
    }
}

/**
 * สร้าง skill tag element
 */
function createSkillTag(skill, onClickAction) {
    const skillTag = document.createElement('div');
    skillTag.className = 'skill-tag';
    skillTag.innerHTML = `
        <span>${skill.name}</span>
        <button type="button" class="skill-remove" onclick="${onClickAction}">×</button>
    `;
    return skillTag;
}

// ==================== EVENT HANDLERS ====================

/**
 * จัดการการเปลี่ยนแปลงของ main skill select
 */
function handleMainSkillSelectChange(event) {
    const addBtn = document.getElementById('addSkillBtn');
    if (addBtn) {
        addBtn.disabled = event.target.value === '' || !event.target.value;
        console.log('Main skill select changed:', event.target.value, 'Button disabled:', addBtn.disabled);
    }
}

/**
 * จัดการการเปลี่ยนแปลงของ project skill select
 */
function handleProjectSkillSelectChange(event) {
    if (event.target.classList.contains('project-skill-select')) {
        const projectIndex = parseInt(event.target.dataset.project);
        const addButton = event.target.closest('.input-group').querySelector('.btn-success');
        if (addButton) {
            addButton.disabled = event.target.value === '' || !event.target.value;
            console.log(`Project ${projectIndex} skill select changed:`, event.target.value, 'Button disabled:', addButton.disabled);
        }
    }
}

/**
 * จัดการการส่งฟอร์ม
 */
async function handleFormSubmission(event) {
    event.preventDefault();

    try {
        // แสดง loading
        await Swal.fire({
            title: 'กำลังบันทึกข้อมูล...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        const formData = new FormData(event.target);
        const response = await fetch('process_portfolio.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        Swal.close();

        if (result.success) {
            await showSuccess('สำเร็จ!', result.message);
            // window.location.href = 'success.php';
        } else {
            await showError('เกิดข้อผิดพลาด', result.message);
        }

    } catch (error) {
        console.error('Form submission error:', error);
        Swal.close();
        await showError('เกิดข้อผิดพลาด', 'ไม่สามารถส่งข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    }
}

// ==================== IMAGE HANDLING ====================

/**
 * จัดการการอัพโหลดรูปภาพ
 */
function handleImageUpload(input, uploaderId) {
    const uploader = document.getElementById(uploaderId);
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploader.innerHTML = createImagePreviewHTML(e.target.result, input.id, uploaderId);
        };
        reader.readAsDataURL(file);
    }
}

/**
 * ลบรูปภาพ
 */
function removeImage(uploaderId, inputId) {
    const uploader = document.getElementById(uploaderId);
    const input = document.getElementById(inputId);

    if (input) input.value = '';
    if (uploader) {
        uploader.innerHTML = createImageUploaderHTML(inputId);
    }
}

/**
 * สร้าง HTML สำหรับแสดงตัวอย่างรูปภาพ
 */
function createImagePreviewHTML(imageSrc, inputId, uploaderId) {
    return `
        <div class="image-preview">
            <img src="${imageSrc}" alt="Preview" style="max-height: 160px; border-radius: 8px; object-fit: cover;">
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

/**
 * สร้าง HTML สำหรับ image uploader
 */
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

// ==================== DRAG & DROP FUNCTIONALITY ====================

/**
 * ตั้งค่า Sortable Event Listeners
 */
function setupSortableEventListeners() {
    setupContainerSortable('workExperienceContainer', 'work-item', 'work');
    setupContainerSortable('educationContainer', 'education-item', 'education');
    setupContainerSortable('projectsContainer', 'project-item', 'project');
}

/**
 * ตั้งค่า Sortable สำหรับ Container
 */
function setupContainerSortable(containerId, itemClass, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', (e) => handleDrop(e, type));
}

/**
 * ทำให้ item สามารถ drag and drop ได้
 */
function makeSortableItem(element, type) {
    const itemHeader = element.querySelector('.item-header');
    if (!itemHeader) return;

    // เพิ่ม drag handle
    const dragHandle = createDragHandle();
    itemHeader.insertBefore(dragHandle, itemHeader.firstChild);

    // ตั้งค่า draggable
    element.draggable = true;
    element.classList.add('draggable');
    element.addEventListener('dragstart', (e) => handleDragStart(e, type));
    element.addEventListener('dragend', handleDragEnd);
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
}

/**
 * สร้าง drag handle
 */
function createDragHandle() {
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '⋮⋮';
    dragHandle.style.cssText = `
        cursor: grab;
        padding: 8px;
        color: #666;
        font-size: 18px;
        line-height: 1;
        user-select: none;
        margin-right: 8px;
    `;

    // Cursor effects
    dragHandle.addEventListener('mouseenter', () => dragHandle.style.cursor = 'grab');
    dragHandle.addEventListener('mousedown', () => dragHandle.style.cursor = 'grabbing');
    dragHandle.addEventListener('mouseup', () => dragHandle.style.cursor = 'grab');

    return dragHandle;
}

// Drag Event Handlers
function handleDragStart(e, type) {
    draggedElement = e.target;
    draggedType = type;
    e.target.style.opacity = '0.5';
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    e.target.classList.remove('dragging');
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    draggedElement = null;
    draggedType = null;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const container = e.currentTarget;
    const afterElement = getDragAfterElement(container, e.clientY);

    if (afterElement == null) {
        container.appendChild(draggedElement);
    } else {
        container.insertBefore(draggedElement, afterElement);
    }
}

function handleDrop(e, type) {
    e.preventDefault();
    if (draggedType !== type) return;

    updateItemNumbers(type);
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    console.log(`${type} items reordered`);
}

function handleDragEnter(e) {
    if (e.target.classList.contains(draggedElement?.className.split(' ')[0])) {
        e.target.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    if (!e.target.contains(e.relatedTarget)) {
        e.target.classList.remove('drag-over');
    }
}

/**
 * หา element ที่ควรจะ insert ก่อน
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * อัพเดทหมายเลขของ items หลังจาก reorder
 */
function updateItemNumbers(type) {
    const configs = {
        work: { selector: '#workExperienceContainer .work-item', prefix: 'Experience' },
        education: { selector: '#educationContainer .education-item', prefix: 'Education' },
        project: { selector: '#projectsContainer .project-item', prefix: 'Project' }
    };

    const config = configs[type];
    if (!config) return;

    const items = document.querySelectorAll(config.selector);
    items.forEach((item, index) => {
        const title = item.querySelector('.item-title');
        if (title) {
            title.textContent = `${config.prefix} #${index + 1}`;
        }
        item.dataset.index = index;
    });
}

// ==================== WORK EXPERIENCE MANAGEMENT ====================

/**
 * เพิ่มประสบการณ์การทำงาน
 */
function addWorkExperience() {
    const container = document.getElementById('workExperienceContainer');
    if (!container) return;

    const newItem = createWorkExperienceItem(workExperienceCount);
    container.appendChild(newItem);
    makeSortableItem(newItem, 'work');
    workExperienceCount++;
}

/**
 * สร้าง Work Experience Item
 */
function createWorkExperienceItem(index) {
    const item = document.createElement('div');
    item.className = 'work-item';
    item.dataset.index = index;
    item.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">Experience #${index + 1}</h3>
            <button type="button" class="btn btn-danger" onclick="removeWorkExperience(${index})">
                Remove
            </button>
        </div>
        
        <div class="grid grid-cols-2">
            <div class="form-group">
                <label class="form-label">Company Name *</label>
                <input type="text" name="work_experience[${index}][company_name]" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Position *</label>
                <input type="text" name="work_experience[${index}][position]" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Employment Type</label>
                <select name="work_experience[${index}][employee_type]" class="form-select">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>
            
            <div class="form-group">
                <div class="grid grid-cols-2">
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" name="work_experience[${index}][start_date]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" name="work_experience[${index}][end_date]" class="form-input">
                    </div>
                </div>
            </div>
            
            <div class="form-group col-span-2">
                <label class="form-label">Job Description</label>
                <textarea name="work_experience[${index}][position_description]" class="form-textarea" rows="3"></textarea>
            </div>
        </div>
    `;
    return item;
}

/**
 * ลบประสบการณ์การทำงาน
 */
function removeWorkExperience(index) {
    const parsedIndex = parseInt(index);
    const item = document.querySelector(`.work-item[data-index="${parsedIndex}"]`);
    if (item) {
        item.remove();
    }
}

// ==================== EDUCATION MANAGEMENT ====================

/**
 * เพิ่มข้อมูลการศึกษา
 */
function addEducation() {
    const container = document.getElementById('educationContainer');
    if (!container) return;

    const newItem = createEducationItem(educationCount);
    container.appendChild(newItem);
    makeSortableItem(newItem, 'education');
    educationCount++;
}

/**
 * สร้าง Education Item
 */
function createEducationItem(index) {
    const item = document.createElement('div');
    item.className = 'education-item';
    item.dataset.index = index;
    item.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">Education #${index + 1}</h3>
            <button type="button" class="btn btn-danger" onclick="removeEducation(${index})">
                Remove
            </button>
        </div>
        
        <div class="grid grid-cols-2">
            <div class="form-group">
                <label class="form-label">Institution Name *</label>
                <input type="text" name="education[${index}][education_name]" class="form-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Degree *</label>
                <input type="text" name="education[${index}][degree]" class="form-input" placeholder="e.g., Bachelor's, Master's" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Faculty/School</label>
                <input type="text" name="education[${index}][faculty_name]" class="form-input">
            </div>
            
            <div class="form-group">
                <label class="form-label">Major/Field of Study</label>
                <input type="text" name="education[${index}][major_name]" class="form-input">
            </div>
            
            <div class="form-group col-span-2">
                <div class="grid grid-cols-2">
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" name="education[${index}][start_date]" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">End Date</label>
                        <input type="date" name="education[${index}][end_date]" class="form-input">
                    </div>
                </div>
            </div>
        </div>
    `;
    return item;
}

/**
 * ลบข้อมูลการศึกษา
 */
function removeEducation(index) {
    const parsedIndex = parseInt(index);
    const item = document.querySelector(`.education-item[data-index="${parsedIndex}"]`);
    if (item) {
        item.remove();
    }
}

// ==================== PROJECT MANAGEMENT ====================

/**
 * เพิ่มโปรเจค
 */
function addProject() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    const newItem = createProjectItem(projectCount);
    container.appendChild(newItem);
    makeSortableItem(newItem, 'project');
    populateProjectSkillsDropdown();
    projectCount++;
}

/**
 * สร้าง Project Item
 */
function createProjectItem(index) {
    const item = document.createElement('div');
    item.className = 'project-item';
    item.dataset.index = index;
    item.innerHTML = `
        <div class="item-header">
            <h3 class="item-title">Project #${index + 1}</h3>
            <button type="button" class="btn btn-danger" onclick="removeProject(${index})">
                Remove
            </button>
        </div>
        
        <div class="form-group">
            <label class="form-label">Project Title *</label>
            <input type="text" name="projects[${index}][project_title]" class="form-input" required>
        </div>
        
        <div class="form-group">
            <label class="form-label">Project Image</label>
            <div class="image-uploader" id="projectImageUploader_${index}">
                <div class="upload-placeholder">
                    <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <button type="button" class="btn btn-primary" onclick="document.getElementById('projectImage_${index}').click()">
                        Upload Image
                    </button>
                    <p style="font-size: 12px; color: #6b7280;">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>
            <input type="file" id="projectImage_${index}" name="projects[${index}][project_image]" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'projectImageUploader_${index}')">
        </div>
        
        <div class="form-group">
            <label class="form-label">Key Points/Description</label>
            <textarea name="projects[${index}][key_point]" class="form-textarea" rows="3" placeholder="Describe the project, your role, and key achievements..."></textarea>
        </div>
        
        <div class="skills">
            <h4>Technologies Used in This Project</h4>
            
            <div class="selector">
                <div class="input-group">
                    <div class="form-group">
                        <label class="form-label">Select Skill</label>
                        <select class="form-select project-skill-select" data-project="${index}">
                            <option value="">Choose a skill...</option>
                        </select>
                    </div>
                    <button type="button" class="btn btn-success" onclick="addProjectSkill(${index})" disabled>
                        Add Skill
                    </button>
                </div>
            </div>

            <div class="selected-skills project-skills-container" data-project="${index}" style="display: none;">
                <h5>Selected Skills (<span class="project-skill-count">0</span>)</h5>
                <div class="skills-list project-skills-list"></div>
            </div>
            
            <div class="empty-state project-skills-empty" data-project="${index}">
                No skills selected yet. Use the dropdown above to add skills.
            </div>
            
            <input type="hidden" name="projects[${index}][skills]" class="project-skills-input">
        </div>
    `;
    return item;
}

/**
 * ลบโปรเจค
 */
function removeProject(index) {
    const parsedIndex = parseInt(index);
    const item = document.querySelector(`.project-item[data-index="${parsedIndex}"]`);
    if (item) {
        delete projectSkills[parsedIndex];
        item.remove();
    }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * แสดงข้อความแจ้งเตือนแบบ success
 */
async function showSuccess(title, text) {
    return await Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        confirmButtonText: 'ตกลง'
    });
}

/**
 * แสดงข้อความแจ้งเตือนแบบ error
 */
async function showError(title, text) {
    return await Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        confirmButtonText: 'ตกลง'
    });
}

/**
 * แสดงข้อความแจ้งเตือนแบบ loading
 */
async function showLoading(title = 'กำลังประมวลผล...') {
    return await Swal.fire({
        title: title,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
}

/**
 * ปิดข้อความแจ้งเตือน
 */
function closeAlert() {
    Swal.close();
}

/**
 * ตรวจสอบว่าข้อมูลใน array หรือไม่
 */
function isValidArray(data) {
    return Array.isArray(data) && data.length > 0;
}

/**
 * แปลงค่าเป็น integer และตรวจสอบความถูกต้อง
 */
function parseIntSafely(value, defaultValue = 0) {
    const parsed = parseInt(value);
    return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * ค้นหา skill จาก ID
 */
function findSkillById(skillId) {
    const parsedId = parseIntSafely(skillId);
    return allSkills.find(skill => parseIntSafely(skill.id) === parsedId);
}

/**
 * ตรวจสอบว่า skill ถูกเลือกแล้วหรือไม่
 */
function isSkillSelected(skillId, skillsArray = selectedSkills) {
    const parsedId = parseIntSafely(skillId);
    return skillsArray.includes(parsedId);
}

/**
 * ล้างข้อมูลใน form element
 */
function clearFormElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = '';
    }
}

/**
 * ตั้งค่าสถานะของ button
 */
function setButtonState(buttonElement, disabled = true) {
    if (buttonElement) {
        buttonElement.disabled = disabled;
    }
}

/**
 * ค้นหา element ด้วย selector และ dataset
 */
function findElementWithDataset(selector, datasetKey, datasetValue) {
    return document.querySelector(`${selector}[data-${datasetKey}="${datasetValue}"]`);
}

/**
 * อัพเดทข้อความใน element
 */
function updateElementText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

/**
 * อัพเดท innerHTML ของ element
 */
function updateElementHTML(element, html) {
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * แสดงหรือซ่อน element
 */
function toggleElementVisibility(element, show = true) {
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * เพิ่มหรือลบ CSS class
 */
function toggleClass(element, className, add = true) {
    if (element) {
        if (add) {
            element.classList.add(className);
        } else {
            element.classList.remove(className);
        }
    }
}

/**
 * สร้าง option element สำหรับ select
 */
function createOptionElement(value, text, selected = false) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    option.selected = selected;
    return option;
}

/**
 * ล้าง options ทั้งหมดใน select element
 */
function clearSelectOptions(selectElement) {
    if (selectElement) {
        selectElement.innerHTML = '';
    }
}

/**
 * เพิ่ม default option ใน select
 */
function addDefaultOption(selectElement, text = 'Choose an option...') {
    if (selectElement) {
        const defaultOption = createOptionElement('', text);
        selectElement.appendChild(defaultOption);
    }
}

/**
 * รีเซ็ตสถานะของ select element
 */
function resetSelectElement(selectElement, defaultText = 'Choose an option...') {
    clearSelectOptions(selectElement);
    addDefaultOption(selectElement, defaultText);
}

/**
 * ตรวจสอบว่า element มีอยู่หรือไม่
 */
function elementExists(elementId) {
    return document.getElementById(elementId) !== null;
}

/**
 * ดีบัก: แสดงข้อมูลใน console
 */
function debugLog(message, data = null) {
    if (console && console.log) {
        if (data) {
            console.log(message, data);
        } else {
            console.log(message);
        }
    }
}

/**
 * ดีบัก: แสดงข้อผิดพลาดใน console
 */
function debugError(message, error = null) {
    if (console && console.error) {
        if (error) {
            console.error(message, error);
        } else {
            console.error(message);
        }
    }
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
    return value && value.toString().trim() !== '';
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
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
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

// ==================== EXPORT FOR TESTING ====================
// หากต้องการทดสอบฟังก์ชันต่างๆ สามารถ export ได้
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Core functions
        loadSkillsFromServer,
        addSkill,
        removeSkill,
        addProjectSkill,
        removeProjectSkill,
        
        // Utility functions
        isValidArray,
        parseIntSafely,
        findSkillById,
        isSkillSelected,
        
        // Validation functions
        isValidEmail,
        isValidPhoneNumber,
        isNotEmpty,
        isValidLength,
        isValidImageFile,
        isValidDate,
        isValidDateRange
    };
}