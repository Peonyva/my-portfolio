<?php require 'config.php'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Register</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="scripts/register.js"></script>
  <link rel="stylesheet" href="styles/register.css" />
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>Portfolio Information</h1>
      <p>Fill out your information to create your professional portfolio</p>
    </div>

    <form id="portfolioForm" method="POST" action="insert.php" enctype="multipart/form-data">
      <!-- Personal Information Section -->
      <section>
        <h2 class="title">
          <span class="number">1</span>Personal Information
        </h2>

        <div class="grid grid-cols-2">
          <div class="form-group">
            <label class="form-label">First Name *</label>
            <input type="text" name="firstName" class="form-input" required>
          </div>

          <div class="form-group">
            <label class="form-label">Last Name *</label>
            <input type="text" name="lastName" class="form-input" required>
          </div>

          <div class="form-group col-span-2">
            <label class="form-label">Professional Title *</label>
            <input type="text" name="position" class="form-input" placeholder="e.g., Full Stack Developer, UI/UX Designer" required>
          </div>

          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" name="email" autocomplete="email" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">Phone</label>
            <input type="tel" name="phone" autocomplete="tel" class="form-input">
          </div>


          <!-- <div class="form-group">
            <label class="form-label">Location</label>
            <input type="text" name="location" class="form-input" placeholder="e.g., Bangkok, Thailand">
          </div>

          <div class="form-group">
            <label class="form-label">GitHub URL</label>
            <input type="url" name="github" class="form-input" placeholder="https://github.com/username">
          </div> -->

          <div class="form-group col-span-2">
            <label class="form-label">Profile Picture</label>
            <div class="image-uploader" id="myImageUploader">
              <div class="upload-placeholder">
                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <button type="button" class="btn btn-primary" onclick="document.getElementById('myImage').click()">Upload Image</button>
                <p>PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            <input type="file" id="myImage" name="myImage" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'myImageUploader')">
          </div>

          <div class="form-group col-span-2">
            <label class="form-label">Cover Image</label>
            <div class="image-uploader" id="coverImageUploader">
              <div class="upload-placeholder">
                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <button type="button" class="btn btn-primary" onclick="document.getElementById('coverImage').click()">Upload Image</button>
                <p>PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            <input type="file" id="coverImage" name="coverImage" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'coverImageUploader')">
          </div>

          <!-- <div class="form-group col-span-2">
            <label class="form-label">LinkedIn URL</label>
            <input type="url" name="linkedin" class="form-input" placeholder="https://linkedin.com/in/username">
          </div> -->
        </div>

        <div class="form-group" style="margin-top: 16px;">
          <label class="form-label">About Me</label>
          <textarea name="introContent" class="form-textarea" rows="4" placeholder="Write a brief introduction about yourself..."></textarea>
        </div>
      </section>

      <!-- Skills Section -->
      <section>
        <h2 class="title">
          <span class="number">2</span>Skills
        </h2>
        <div class="skills">
          <h4>Select your skills</h4>
          <div class="selector">
            <div class="input-group">
              <div class="form-group">
                <label class="form-label">Select Skill</label>
                <select id="skillSelect" class="form-select">
                  <option value="">Choose a skill...</option>
                </select>
              </div>
              <button type="button" id="addSkillBtn" class="btn btn-success" onclick="addSkill()" disabled>
                Add Skill
              </button>
            </div>
          </div>

          <div id="selectedSkillsContainer" class="selected-skills">
            <h5>Selected Skills (<span id="skillCount">0</span>)</h5>
            <div id="skillsList" class="skills-list"></div>
          </div>

          <div id="emptySkillsState" class="empty-state">
            No skills selected yet. Use the dropdown above to add skills.
          </div>
        </div>
        <input type="hidden" name="selectedSkills" id="selectedSkillsInput">
        <!-- <input type="hidden" name="selected_skills" id="selectedSkillsInput"> -->
      </section>

      <!-- Work Experience Section -->
      <section>
        <div class="header">
          <h2 class="title">
            <span class="number">3</span>
            Work Experience
          </h2>
          <button type="button" class="btn btn-primary" onclick="addWorkExperience()">
            <span>+</span> Add Experience
          </button>
        </div>

        <div id="workExperienceContainer">
          <div class="work-item" data-index="0">
            <div class="item-header">
              <h3 class="item-title">Experience #1</h3>
            </div>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Company Name *</label>
                <input type="text" name="workExperience[0][companyName]" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">Position *</label>
                <input type="text" name="workExperience[0][position]" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">Employment Type</label>
                <select name="workExperience[0][employeeType]" class="form-select">
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
                    <input type="date" name="workExperience[0][startDate]" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input type="date" name="workExperience[0][endDate]" class="form-input">
                  </div>
                </div>
              </div>

              <div class="form-group col-span-2">
                <label class="form-label">Job Description</label>
                <textarea name="workExperience[0][positionDescription]" class="form-textarea" rows="3"></textarea>
                <ul id="description-list"></ul>
              </div>
              <div class="form-group col-span-2">
                <label class="form-label">Remark</label>
                <textarea name="workExperience[0][workExperienceRemarks]" class="form-textarea" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Education Section -->
      <section>
        <div class="header">
          <h2 class="title">
            <span class="number">4</span>
            Education
          </h2>
          <button type="button" class="btn btn-primary" onclick="addEducation()">
            <span>+</span> Add Education
          </button>
        </div>

        <div id="educationContainer">
          <div class="education-item" data-index="0">
            <div class="item-header">
              <h3 class="item-title">Education #1</h3>
            </div>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Institution Name *</label>
                <input type="text" name="education[0][educationName]" class="form-input" required>
              </div>

              <div class="form-group">
                <label class="form-label">Degree *</label>
                <input type="text" name="education[0][degree]" class="form-input" placeholder="e.g., Bachelor's, Master's" required>
              </div>

              <div class="form-group">
                <label class="form-label">Faculty/School</label>
                <input type="text" name="education[0][facultyName]" class="form-input">
              </div>

              <div class="form-group">
                <label class="form-label">Major/Field of Study</label>
                <input type="text" name="education[0][majorName]" class="form-input">
              </div>

              <div class="form-group col-span-2">
                <div class="grid grid-cols-2">
                  <div class="form-group">
                    <label class="form-label">Start Date</label>
                    <input type="date" name="education[0][startDate]" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">End Date</label>
                    <input type="date" name="education[0][endDate]" class="form-input">
                  </div>
                </div>
              </div>
              <div class="form-group col-span-2">
                <label class="form-label">Remark</label>
                <textarea name="education[0][educationRemarks]" class="form-textarea" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects Section -->
      <section>
        <div class="header">
          <h2 class="title">
            <span class="number">5</span>
            Projects
          </h2>
          <button type="button" class="btn btn-primary" onclick="addProject()">
            <span>+</span> Add Project
          </button>
        </div>

        <div id="projectsContainer">
          <div class="project-item" data-index="0">
            <div class="item-header">
              <h3 class="item-title">Project #1</h3>
            </div>

            <div class="form-group">
              <label class="form-label">Project Title *</label>
              <input type="text" name="projects[0][projectTitle]" class="form-input" required>
            </div>

            <div class="form-group">
              <label class="form-label">Project Image</label>
              <div class="image-uploader" id="projectImageUploader_0">
                <div class="upload-placeholder">
                  <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <button type="button" class="btn btn-primary" onclick="document.getElementById('projectImage_0').click()">
                    Upload Image
                  </button>
                  <p>PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              <input type="file" id="projectImage_0" name="projects[0][projectImage]" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'projectImageUploader_0')">
            </div>

            <div class="form-group">
              <label class="form-label">Project Description</label>
              <textarea name="projects[0][keyPoint]" class="form-textarea" rows="3" placeholder="Describe the project, your role, and key achievements..."></textarea>
            </div>

            <div class="skills">
              <h4>Technologies Used in This Project</h4>

              <div class="selector">
                <div class="input-group">
                  <div class="form-group">
                    <label class="form-label">Select Skill</label>
                    <select class="form-select project-skill-select" name="project-skill-select" data-project="0">
                      <option value="">Choose a skill...</option>
                    </select>
                  </div>
                  <button type="button" class="btn btn-success" onclick="addProjectSkill(0)" disabled>Add Skill</button>
                </div>
              </div>

              <div class="selected-skills project-skills-container" data-project="0">
                <h5>Selected Skills (<span class="project-skill-count">0</span>)</h5>
                <div class="skills-list project-skills-list"></div>
              </div>

              <div class="empty-state project-skills-empty" data-project="0">
                No skills selected yet. Use the dropdown above to add skills.
              </div>

              <input type="hidden" name="projects[0][skills]" class="project-skills-input">
            </div>
          </div>
        </div>
      </section>

      <!-- Submit Button -->
      <div class="submit-section">
        <button type="submit" class="btn-submit">
          Save Portfolio Data
        </button>
      </div>
    </form>
  </div>

</body>

</html>