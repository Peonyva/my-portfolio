<?php require_once 'config.php'?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Portfolio</title>
  <script src="https://kit.fontawesome.com/92f0aafca7.js" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="styles/index.css" />
</head>

<body>
  <!-- Header -->
  <header class="header">
    <div class="container">
      <nav class="nav-container">
        <div class="logo">
          <img src="assets/logo3.jpg" alt="Logo" />My Portfolio
        </div>
        <ul class="nav-menu" id="nav-menu">
          <li><a href="#aboutme" class="nav-link active">About Me</a></li>
          <li><a href="#skills" class="nav-link">Skills</a></li>
          <li><a href="#projects" class="nav-link">Projects</a></li>
          <li><a href="#experience" class="nav-link">Work Experience</a></li>
          <li><a href="#education" class="nav-link">Education</a></li>
        </ul>
        <div class="hamburger" id="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </div>
  </header>
  <!-- End Header -->

  <div class="container">
    <section class="hero" id="aboutme">
      <div class="cover-photo">
          <img src="assets/cover_image.jpg" alt="Cover Photo" />
      </div>

      <!-- Profile -->
      <div class="profile">
        <div class="profile-content">
          <div class="profile-image">
            <img src="assets/profile3.jpg" alt="Profile Image" />
          </div>
          <div class="profile-info">
            <h1>Siratchara Pronvootikul</h1>
            <p class="subtitle">Web Developer Freelance</p>
          </div>
          <div class="divider"></div>
          <div class="contact-info">
            <a href="mailto:siratchara.pronvootikul@gmail.com" target="_blank" class="contact-item">
              <i class="fas fa-envelope"></i>siratchara.pronvootikul@gmail.com
            </a>
            <a href="https://www.facebook.com/siratchara.pronvootikul" target="_blank" class="contact-item">
              <i class="fab fa-facebook"></i>Siratchara Pronvootikul
            </a>
            <a href="#" class="share-btn" target="_blank"><i class="fas fa-share"></i>Share Profile</a>
          </div>
        </div>
      </div>
    </section>
    <!-- End Section -->

    <main>
      <!-- Intro -->
      <section>
        <h2>Intro</h2>
        <div class="intro-content">
          <p>I specialize in UI Design and Web Application Development. I enjoy building clean, user-focused interfaces and writing efficient code with PHP, JavaScript, HTML, and CSS. My goal is to create websites and applications that are both beautiful and functional.</p>
        </div>
      </section>

      <!-- Skills  -->
      <section id="skills">
        <h2>Skills</h2>
        <ul>
          <li>Coding Web Applications using PHP / JavaScript / HTML / CSS</li>
          <li>Database Integration (MySQL)</li>
          <li>Website and Mobile App Design in Figma</li>
        </ul>
        <div class="skills-grid">
          <!-- php -->
          <div class="skill-item">
            <div class="skill-icon">
              <i class="fab fa-php skill-icon icon-php"></i>
            </div>
            <div class="skill-name">PHP</div>
          </div>
          <!-- javascript -->
          <div class="skill-item">
            <div class="skill-icon">
              <i class="fab fa-js-square skill-icon icon-javascript"></i>
            </div>
            <div class="skill-name">JavaScript</div>
          </div>
          <!-- html -->
          <div class="skill-item">
            <div class="skill-icon">
              <i class="fab fa-html5 skill-icon icon-html"></i> 
            </div>
            <div class="skill-name">HTML</div>
          </div>
          <!-- css -->
          <div class="skill-item">
            <div class="skill-icon">
              <i class="fab fa-css3-alt skill-icon icon-css"></i>
            </div>
            <div class="skill-name">CSS</div>
          </div>
          <!-- mysql -->
          <div class="skill-item">
            <div class="skill-icon">
              <i class="fas fa-database skill-icon icon-mysql"></i>
            </div>
            <div class="skill-name">MySQL</div>
          </div>
          <!-- figma -->
          <div class="skill-item">
            <div class="skill-icon">
              <img src="assets/figma.png" alt="Figma" style="width: 40px; height: 40px;">
            </div>
            <div class="skill-name">Figma</div>
          </div>
        </div>
      </section>

      <!-- Projects  -->
      <section class="projects" id="projects">
        <h2>Projects</h2>
        <!-- no.1 -->
        <div class="project-card">
          <img src="assets/checklist.png" alt="checklist" />
          <div class="project-content">
            <h3>Dormitory Student Attendance System</h3>
            <ul>
              <li>Designed the UX/UI of the system to ensure user-friendly and efficient interaction.</li>
              <li>Developed the system's frontend using HTML, CSS, JavaScript, and Bootstrap version 4, and the backend using PHP and MySQL.</li>
              <li>The work was accepted for presentation and published in the proceedings of the 47th Electrical Engineering Conference (EECON-47).</li>
            </ul>
            <div class="tech-grid">
              <!-- php -->
              <span class="tech-item">
                <i class="fab fa-php icon-php"></i>
              </span>
              <!-- html -->
              <span class="tech-item">
                <i class="fab fa-html5 icon-html"></i>
              </span>
              <!-- javascript -->
              <span class="tech-item">
                <i class="fab fa-js-square icon-javascript"></i>
              </span>
              <!-- mysql -->
              <span class="tech-item">
                <i class="fas fa-database icon-mysql"></i>
              </span>
            </div>
          </div>
        </div>
        <!-- no.2 -->
        <div class="project-card">
          <img src="assets/hospital.png" alt="hospital" />
          <div class="project-content">
            <h3>Data Center Monitoring System for Phra Chomklao Hospital, Phetchaburi</h3>
            <ul>
              <li>Designed the UX/UI of the system to ensure user-friendly and efficient interaction.</li>
              <li>Developed the frontend using HTML, CSS, JavaScript, and Bootstrap 4.</li>
              <li>Built the backend with PHP and MySQL.</li>
            </ul>
            <div class="tech-grid">
              <!-- php -->
              <span class="tech-item">
                <i class="fab fa-php icon-php"></i>
              </span>
              <!-- html -->
              <span class="tech-item">
                <i class="fab fa-html5 icon-html"></i>
              </span>
              <!-- javascript -->
              <span class="tech-item">
                <i class="fab fa-js-square icon-javascript"></i>
              </span>
              <!-- mysql -->
              <span class="tech-item">
                <i class="fas fa-database icon-mysql"></i>
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Work Experience -->
      <section class="experience" id="experience">
        <h2>Work Experience</h2>

        <div class="timeline-card">
          <div class="timeline-item">
            <div class="title">2024 — Internship (4 months)</div>
            <li>Phra Chomklao Hospital, Phetchaburi Province</li>
            <li>Position: Web Application & IT Support</li>
          </div>
        </div>

        <div class="timeline-card">
          <div class="timeline-item">
            <div class="title">2020 — Internship (8 months)</div>
            <li>Cha-am Hospital, Phetchaburi Province</li>
            <li> Position: Data Collection from On-Site Operations</li>
          </div>
        </div>
      </section>

      <!-- Education -->
      <section class="education" id="education">
        <h2>Education</h2>

        <div class="timeline-card">
          <div class="timeline-item">
            <div class="title">2021 – 2024 Bachelor's Degree</div>
            <li>Phetchaburi Rajabhat University</li>
            <li>Faculty of Information Technology</li>
            <li>Major: Computer Science</li>
          </div>
        </div>

        <div class="timeline-card">
          <div class="timeline-item">
            <div class="title">2019 – 2021 Higher Vocational Certificate </div>
            <ul>
              <li>Wangkaikangwon Industrial and Community Education College 2</li>
              <li>Department: Business Computer</li>
            </ul>
          </div>
        </div>
      </section>

    </main>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>&copy; 2025 Pronvootikul, S. All rights reserved.</p>
    </div>
  </footer>

  <script src="scripts/index.js"></script>
</body>

</html>