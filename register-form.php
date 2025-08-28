<?php require 'config.php'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Register - Portfolio Information</title>
    <script src="https://kit.fontawesome.com/92f0aafca7.js" crossorigin="anonymous"></script>
    <script src="/scripts/jquery-3.7.1.min.js"></script>
    <link rel="stylesheet" href="/styles/register.css" />

</head>

<body>
    <header>
        <div class="container">
            <div class="header-con">
                <h1>Portfolio Information</h1>
                <p>Fill out your information to create your professional portfolio</p>
            </div>
        </div>
    </header>

    <main>


        <form id="personalForm" method="POST" enctype="multipart/form-data">
            <section>
                <h2 class="title">
                    <span class="number">1</span>Personal Information
                </h2>

                <div class="grid grid-cols-2">
                    <div class="form-group">
                        <label class="form-label required">First Name</label>
                        <input type="text" name="firstname" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Last Name</label>
                        <input type="text" name="lastname" class="form-input" required>
                    </div>

                    <div class="form-group col-span-2">
                        <label class="form-label required">Professional Title</label>
                        <input type="text" name="position" class="form-input" placeholder="e.g., Full Stack Developer, UI/UX Designer" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Email</label>
                        <input type="email" name="email" autocomplete="email" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label required">Phone</label>
                        <input type="tel" name="phone" autocomplete="tel" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Facebook Name</label>
                        <input type="text" name="facebook" class="form-input" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Facebook URL</label>
                        <input type="url" name="facebookUrl" class="form-input" placeholder="https://facebook.com/yourname" required>
                    </div>

                    <!-- Logo Image Upload -->
                    <div class="form-group col-span-2">
                        <label class="form-label required">Logo Image</label>
                        <div class="image-uploader" id="logoImageUploader">
                            <div class="upload-placeholder">
                                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <button type="button" class="btn btn-primary" onclick="document.getElementById('logoImage').click()">Upload Logo</button>
                                <p>PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        <input type="file" id="logoImage" name="logoImage" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'logoImageUploader')" required>
                    </div>

                    <!-- Profile Image Upload -->
                    <div class="form-group col-span-2">
                        <label class="form-label required">Profile Image</label>
                        <div class="image-uploader" id="profileImageUploader">
                            <div class="upload-placeholder">
                                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <button type="button" class="btn btn-primary" onclick="document.getElementById('profileImage').click()">Upload Profile Image</button>
                                <p>PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        <input type="file" id="profileImage" name="profileImage" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'profileImageUploader')" required>
                    </div>

                    <!-- Cover Image Upload -->
                    <div class="form-group col-span-2">
                        <label class="form-label required">Cover Image</label>
                        <div class="image-uploader" id="coverImageUploader">
                            <div class="upload-placeholder">
                                <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <button type="button" class="btn btn-primary" onclick="document.getElementById('coverImage').click()">Upload Cover Image</button>
                                <p>PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                        <input type="file" id="coverImage" name="coverImage" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'coverImageUploader')" required>
                    </div>
                </div>

                <div class="form-group custom-margin">
                    <label class="form-label required">About Me</label>
                    <textarea name="introContent" class="form-textarea" rows="4" placeholder="Tell us about your professional background, achievements, and career goals." required></textarea>
                </div>
                <button type="submit" id="uploadPersonal" name="uploadPersonal">save</button>
            </section>
        </form>

        <script type="text/javascript">
            $(document).ready(function() {
                $("#personalForm").on("submit", function(e) {
                    e.preventDefault();

                    var formData = new FormData(this);

                    $.ajax({
                        url: "insert.php",
                        type: "POST",
                        data: formData,
                        processData: false, // ห้าม jQuery แปลงข้อมูล
                        contentType: false, // ให้ browser ตั้ง content-type อัตโนมัติ
                        dataType: "json", // ให้ jQuery แปลง JSON ให้เป็น object อัตโนมัติ
                        success: function(res) {
                            console.log(res);
                            if (res.status == "1") {
                                $("#userID").val(res.userID);

                                $("#informationForm").show();
                            } else {
                                console.error("Error: " + res.message);
                            }
                        }
                    });
                });

            });
        </script>

        <!-- 
        <script type="text/javascript">
            $(document).ready(function() {
                $("#btnSavePersonal").click(function() {
                    console.log($("#personalForm").serialize());
                    $.ajax({
                        url: "insert.php",
                        type: "POST",
                        data: $("#personalForm").serialize(),
                        success: function(res) {
                            if (res.status == "1") // เปลี่ยนจาก res.success เป็น res.status == "1"
                            {
                                $("#userId").val(res.userId);
                                $("#informationForm").show();
                            } else {
                                var Result = JSON.parse(res);
                                console.error("Error: " + Result.message);
                            }
                        }
                    });
                });
            });
        </script> -->


        <form id="informationForm" class="hidden" action="#" method="POST" enctype="multipart/form-data">
            <input type="hidden" id="userID" name="userID">
            <!-- Section 2: Skills -->
            <section>
                <h2 class="title">
                    <span class="number">2</span>Skills
                </h2>
                <div class="form-group ">
                    <label class="form-label required">Description my skills</label>
                    <textarea name="skillsContent" class="form-textarea" rows="4" placeholder="List your technical skills, programming languages, software, and other relevant abilities." required></textarea>
                </div>
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
            </section>

            <!-- Section 3: Work Experience -->
            <section>
                <div class="header">
                    <h2 class="title">
                        <span class="number">3</span>Work Experience
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
                                <label class="form-label required">Company Name</label>
                                <input type="text" name="workExperience[0][companyName]" class="form-input" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Position</label>
                                <input type="text" name="workExperience[0][position]" class="form-input" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Employment Type</label>
                                <select name="workExperience[0][employeeType]" class="form-select" required>
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
                                        <input type="date" name="workExperience[0][startDate]" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">End Date</label>
                                        <input type="date" name="workExperience[0][endDate]" class="form-input">
                                    </div>

                                </div>
                                <div class="form-group mt-2">
                                    <div class="flex items-center">
                                        <input type="checkbox" name="workExperience[0][current]" value="1" class="form-checkbox">
                                        <label class="ml-2">I currently work here</label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-span-2">
                                <label class="form-label required">Job Description</label>
                                <textarea name="workExperience[0][positionDescription]" class="form-textarea" rows="3" required></textarea>
                            </div>

                            <div class="form-group col-span-2">
                                <label class="form-label">Remark</label>
                                <textarea name="workExperience[0][workExperienceRemarks]" class="form-textarea" rows="3"></textarea>
                            </div>
                        </div>

                        <div class="button-container">
                            <button type="button" class="btn btn-danger" onclick="removeWorkExperience(0)">Remove</button>
                        </div>

                    </div>
                </div>
            </section>

            <!-- Section 4: Education -->
            <section>
                <div class="header">
                    <h2 class="title">
                        <span class="number">4</span>Education
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
                                <label class="form-label required">Institution Name</label>
                                <input type="text" name="education[0][educationName]" class="form-input" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Degree</label>
                                <input type="text" name="education[0][degree]" class="form-input" placeholder="e.g., Bachelor's, Master's" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Faculty</label>
                                <input type="text" name="education[0][facultyName]" class="form-input" required>
                            </div>

                            <div class="form-group">
                                <label class="form-label required">Major</label>
                                <input type="text" name="education[0][majorName]" class="form-input" required>
                            </div>

                            <div class="form-group col-span-2">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="form-group">
                                        <label class="form-label required">Start Date</label>
                                        <input type="date" name="education[0][startDate]" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">End Date</label>
                                        <input type="date" name="education[0][endDate]" class="form-input">
                                    </div>
                                </div>
                                <div class="form-group mt-2">
                                    <div class="flex items-center">
                                        <input type="checkbox" name="education[0][isCurrent]" value="1" class="form-checkbox">
                                        <label class="ml-2">Currently studying here</label>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group col-span-2">
                                <label class="form-label">Remark</label>
                                <textarea name="education[0][educationRemarks]" class="form-textarea" rows="3"></textarea>
                            </div>
                        </div>
                        <div class="button-container">
                            <button type="button" class="btn btn-danger" onclick="removeEducation(0)">Remove</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Section 5: Projects -->
            <section>
                <div class="header">
                    <h2 class="title">
                        <span class="number">5</span>Projects
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
                            <label class="form-label required">Project Title</label>
                            <input type="text" name="projects[0][projectTitle]" class="form-input" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Project Image</label>
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
                            <input type="file" id="projectImage_0" name="projects[0][projectImage]" class="file-input" accept="image/*" onchange="handleImageUpload(this, 'projectImageUploader_0')" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label required">Project Description</label>
                            <textarea name="projects[0][keyPoint]" class="form-textarea" rows="3" placeholder="Describe the project, your role, and key achievements..." required></textarea>
                        </div>

                        <div class="skills">
                            <h4>Technologies Used in This Project</h4>

                            <div class="selector">
                                <div class="input-group">
                                    <div class="form-group">
                                        <label class="form-label">Select Skill</label>
                                        <select class="form-select project-skill-select" data-project="0">
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
                        <div class="button-container">
                            <button type="button" class="btn btn-danger" onclick="removeProject(0)">Remove</button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Submit Section -->
            <div class="submit-section">
                <button type="submit" class="btn-submit">
                    Save Portfolio Data
                </button>
            </div>
        </form>



    </main>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="scripts/register.js"></script>
</body>

</html>