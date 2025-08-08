<?php

require 'config.php';

// ตั้งค่า response header
header('Content-Type: application/json');

// ตรวจสอบว่าเป็น POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // เริ่มต้น database transaction
    $conn->beginTransaction();

    // รับข้อมูลจากฟอร์ม
    $personalData = getPersonalInformation();
    $skills = getSelectedSkills();
    $workExperiences = getWorkExperiences();
    $educations = getEducations();
    $projects = getProjects();

    // บันทึกข้อมูลส่วนตัว
    $userId = insertPersonalData($conn, $personalData);

    if (!$userId) {
        throw new Exception('Failed to insert personal data');
    }

    // บันทึก skills
    if (!empty($skills)) {
        insertUserSkills($conn, $userId, $skills);
    }

    // บันทึกประสบการณ์การทำงาน
    if (!empty($workExperiences)) {
        insertWorkExperiences($conn, $userId, $workExperiences);
    }

    // บันทึกการศึกษา
    if (!empty($educations)) {
        insertEducations($conn, $userId, $educations);
    }

    // บันทึกโปรเจค
    if (!empty($projects)) {
        insertProjects($conn, $userId, $projects);
    }

    // Commit transaction
    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Portfolio data saved successfully!',
        'user_id' => $userId
    ]);
} catch (Exception $e) {
    // Rollback transaction on error
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    error_log("Portfolio insert error: " . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save portfolio data: ' . $e->getMessage()
    ]);
}

// ================== HELPER FUNCTIONS ==================

/**
 * รับข้อมูลส่วนตัวจากฟอร์ม
 */
function getPersonalInformation()
{
    $myImage = null;
    $coverImage = null;

    // จัดการอัพโหลดรูปโปรไฟล์
    if (isset($_FILES['myImage']) && $_FILES['myImage']['error'] === UPLOAD_ERR_OK) {
        $myImage = handleImageUpload($_FILES['myImage'], 'profile');
    }

    // จัดการอัพโหลดรูปปก
    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === UPLOAD_ERR_OK) {
        $coverImage = handleImageUpload($_FILES['coverImage'], 'cover');
    }

    return [
        'firstName' => sanitizeInput($_POST['firstName'] ?? ''),
        'lastName' => sanitizeInput($_POST['lastName'] ?? ''),
        'position' => sanitizeInput($_POST['position'] ?? ''),
        'email' => sanitizeInput($_POST['email'] ?? ''),
        'phone' => sanitizeInput($_POST['phone'] ?? ''),
        'myImage' => $myImage,
        'coverImage' => $coverImage,
        'introContent' => sanitizeInput($_POST['introContent'] ?? '')
    ];
}

/**
 * รับรายการ skills ที่เลือก
 */
function getSelectedSkills()
{
    $skillsString = $_POST['selectedSkills'] ?? '';

    if (empty($skillsString)) {
        return [];
    }

    $skillIds = explode(',', $skillsString);
    return array_map('intval', array_filter($skillIds));
}

/**
 * รับข้อมูลประสบการณ์การทำงาน
 */
function getWorkExperiences()
{
    if (!isset($_POST['workExperience']) || !is_array($_POST['workExperience'])) {
        return [];
    }

    $experiences = [];
    $sortBy = 1; // เริ่มจากลำดับที่ 1

    foreach ($_POST['workExperience'] as $experience) {
        if (!empty($experience['companyName']) && !empty($experience['position'])) {
            $experiences[] = [
                'companyName' => sanitizeInput($experience['companyName']),
                'position' => sanitizeInput($experience['position']),
                'positionDescription' => sanitizeInput($experience['positionDescription'] ?? ''),
                'employeeType' => sanitizeInput($experience['employeeType'] ?? 'Full-time'),
                'startDate' => sanitizeInput($experience['startDate'] ?? ''),
                'endDate' => sanitizeInput($experience['endDate'] ?? ''),
                'sortBy' => $sortBy,
                'remarks' => sanitizeInput($experience['workExperienceRemarks'] ?? '')
            ];
            $sortBy++;
        }
    }

    return $experiences;
}

/**
 * รับข้อมูลการศึกษา
 */
function getEducations()
{
    if (!isset($_POST['education']) || !is_array($_POST['education'])) {
        return [];
    }

    $educations = [];
    $sortBy = 1; // เริ่มจากลำดับที่ 1

    foreach ($_POST['education'] as $education) {
        if (!empty($education['educationName']) && !empty($education['degree'])) {
            $educations[] = [
                'educationName' => sanitizeInput($education['educationName']),
                'degree' => sanitizeInput($education['degree']),
                'facultyName' => sanitizeInput($education['facultyName'] ?? ''),
                'majorName' => sanitizeInput($education['majorName'] ?? ''),
                'startDate' => sanitizeInput($education['startDate'] ?? ''),
                'endDate' => sanitizeInput($education['endDate'] ?? ''),
                'sortBy' => $sortBy,
                'remarks' => sanitizeInput($education['educationRemarks'] ?? '')
            ];
            $sortBy++;
        }
    }

    return $educations;
}

/**
 * รับข้อมูลโปรเจค
 */
function getProjects()
{
    if (!isset($_POST['projects']) || !is_array($_POST['projects'])) {
        return [];
    }

    $projects = [];
    foreach ($_POST['projects'] as $index => $project) {
        if (!empty($project['projectTitle'])) {
            $projectImage = null;

            // จัดการอัพโหลดรูปภาพโปรเจค
            if (
                isset($_FILES['projects']['name'][$index]['projectImage']) &&
                $_FILES['projects']['error'][$index]['projectImage'] === UPLOAD_ERR_OK
            ) {

                $projectFile = [
                    'name' => $_FILES['projects']['name'][$index]['projectImage'],
                    'type' => $_FILES['projects']['type'][$index]['projectImage'],
                    'tmp_name' => $_FILES['projects']['tmp_name'][$index]['projectImage'],
                    'error' => $_FILES['projects']['error'][$index]['projectImage'],
                    'size' => $_FILES['projects']['size'][$index]['projectImage']
                ];

                $projectImage = handleImageUpload($projectFile, 'project');
            }

            // รับ skills ของโปรเจค
            $projectSkills = [];
            if (!empty($project['skills'])) {
                $skillIds = explode(',', $project['skills']);
                $projectSkills = array_map('intval', array_filter($skillIds));
            }

            $projects[] = [
                'projectTitle' => sanitizeInput($project['projectTitle']),
                'projectImage' => $projectImage,
                'keyPoint' => sanitizeInput($project['keyPoint'] ?? ''),
                'skills' => $projectSkills
            ];
        }
    }

    return $projects;
}

/**
 * จัดการอัพโหลดรูปภาพ
 */
function handleImageUpload($file, $userID, $type = 'general')
{
    // ตรวจสอบข้อมูลไฟล์
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return null;
    }

    // ตรวจสอบประเภทไฟล์
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Invalid file type. Only JPG, PNG, and GIF are allowed.');
    }

    // ตรวจสอบขนาดไฟล์ (10MB)
    $maxSize = 10 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        throw new Exception('File size too large. Maximum size is 10MB.');
    }

    // สร้างชื่อไฟล์ใหม่
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = $type . '_' . uniqid() . '_' . time() . '.' . $extension;

    // โฟลเดอร์หลัก
    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // โฟลเดอร์ของ user
    $userDir = $uploadDir . $userID . '/';
    if (!is_dir($userDir)) {
        mkdir($userDir, 0755, true);
    }

    // path สำหรับบันทึกไฟล์
    $uploadPath = $userDir . $fileName;

    // อัพโหลดไฟล์
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Failed to upload file.');
    }

    return $uploadPath; // คืน path ที่บันทึกไฟล์
}


/**
 * ทำความสะอาดข้อมูล input
 */
function sanitizeInput($input)
{
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * บันทึกข้อมูลส่วนตัว
 */
function insertPersonalData($conn, $data)
{
    $sql = "INSERT INTO profile (
        firstName, lastName, position, email, phone, 
        myImage, coverImage, introContent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $data['firstName'],
        $data['lastName'],
        $data['position'],
        $data['email'],
        $data['phone'],
        $data['myImage'],
        $data['coverImage'],
        $data['introContent']
    ]);

    return $conn->lastInsertId();
}

/**
 * บันทึก skills ของผู้ใช้
 */
function insertUserSkills($conn, $userId, $skills)
{
    $sql = "INSERT INTO profileSkills (userID, skillsID) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($skills as $skillId) {
        $stmt->execute([$userId, $skillId]);
    }
}

/**
 * บันทึกประสบการณ์การทำงาน
 */
function insertWorkExperiences($conn, $userId, $experiences)
{
    $sql = "INSERT INTO workexperience (
        userID, companyName, position, positionDescription, 
        employeeType, startDate, endDate, sortBy, remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    foreach ($experiences as $exp) {
        $stmt->execute([
            $userId,
            $exp['companyName'],
            $exp['position'],
            $exp['positionDescription'],
            $exp['employeeType'],
            $exp['startDate'] ?: null,
            $exp['endDate'] ?: null,
            $exp['sortBy'],
            $exp['remarks']
        ]);
    }
}

/**
 * บันทึกการศึกษา
 */
function insertEducations($conn, $userId, $educations)
{
    $sql = "INSERT INTO education (
        userID, educationName, degree, facultyName, 
        MajorName, startDate, endDate, sortBy, remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    foreach ($educations as $edu) {
        $stmt->execute([
            $userId,
            $edu['educationName'],
            $edu['degree'],
            $edu['facultyName'],
            $edu['majorName'],
            $edu['startDate'] ?: null,
            $edu['endDate'] ?: null,
            $edu['sortBy'],
            $edu['remarks']
        ]);
    }
}

/**
 * บันทึกโปรเจค
 */
function insertProjects($conn, $userId, $projects)
{
    $projectSql = "INSERT INTO project (
        userID, projectTitle, projectImage, keyPoint
    ) VALUES (?, ?, ?, ?)";

    $projectSkillSql = "INSERT INTO project_skill (
        projectID, skillsID
    ) VALUES (?, ?)";

    $projectStmt = $conn->prepare($projectSql);
    $projectSkillStmt = $conn->prepare($projectSkillSql);

    foreach ($projects as $project) {
        // บันทึกโปรเจค
        $projectStmt->execute([
            $userId,
            $project['projectTitle'],
            $project['projectImage'],
            $project['keyPoint']
        ]);

        $projectId = $conn->lastInsertId();

        // บันทึก skills ของโปรเจค
        if (!empty($project['skills'])) {
            foreach ($project['skills'] as $skillId) {
                $projectSkillStmt->execute([$projectId, $skillId]);
            }
        }
    }
}
