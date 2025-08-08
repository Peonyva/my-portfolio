<?php
require 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $conn->beginTransaction();

    // บันทึกข้อมูลส่วนตัวก่อน (ไม่มีรูปภาพ)
    $personalData = getPersonalInformation();
    $userId = insertPersonalData($conn, $personalData);

    if (!$userId) {
        throw new Exception('Failed to insert personal data');
    }

    // อัพเดทรูปภาพหลังจากได้ userId แล้ว
    $imageUpdates = handleImageUploads($userId);
    if (!empty($imageUpdates)) {
        updatePersonalImages($conn, $userId, $imageUpdates);
    }

    // บันทึกข้อมูลอื่นๆ
    $skills = getSelectedSkills();
    $workExperiences = getWorkExperiences();
    $educations = getEducations();
    $projects = getProjects($userId); // ส่ง userId เพื่ออัพโหลดรูป

    if (!empty($skills)) {
        insertUserSkills($conn, $userId, $skills);
    }

    if (!empty($workExperiences)) {
        insertWorkExperiences($conn, $userId, $workExperiences);
    }

    if (!empty($educations)) {
        insertEducations($conn, $userId, $educations);
    }

    if (!empty($projects)) {
        insertProjects($conn, $userId, $projects);
    }

    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Portfolio data saved successfully!',
        'user_id' => $userId
    ]);

} catch (Exception $e) {
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

function getPersonalInformation() {
    return [
        'firstName' => sanitizeInput($_POST['firstName'] ?? ''),
        'lastName' => sanitizeInput($_POST['lastName'] ?? ''),
        'position' => sanitizeInput($_POST['position'] ?? ''),
        'email' => sanitizeInput($_POST['email'] ?? ''),
        'phone' => sanitizeInput($_POST['phone'] ?? ''),
        'introContent' => sanitizeInput($_POST['introContent'] ?? '')
    ];
}

function handleImageUploads($userId) {
    $images = [];

    if (isset($_FILES['myImage']) && $_FILES['myImage']['error'] === UPLOAD_ERR_OK) {
        $images['myImage'] = handleImageUpload($_FILES['myImage'], $userId, 'profile');
    }

    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === UPLOAD_ERR_OK) {
        $images['coverImage'] = handleImageUpload($_FILES['coverImage'], $userId, 'cover');
    }

    return $images;
}

function updatePersonalImages($conn, $userId, $images) {
    $updates = [];
    $params = [];

    if (isset($images['myImage'])) {
        $updates[] = "myImage = ?";
        $params[] = $images['myImage'];
    }

    if (isset($images['coverImage'])) {
        $updates[] = "coverImage = ?";
        $params[] = $images['coverImage'];
    }

    if (!empty($updates)) {
        $params[] = $userId;
        $sql = "UPDATE profile SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
    }
}

function getSelectedSkills() {
    $skillsString = $_POST['selectedSkills'] ?? '';
    if (empty($skillsString)) {
        return [];
    }
    $skillIds = explode(',', $skillsString);
    return array_map('intval', array_filter($skillIds));
}

function getWorkExperiences() {
    if (!isset($_POST['workExperience']) || !is_array($_POST['workExperience'])) {
        return [];
    }

    $experiences = [];
    $sortBy = 1;

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

function getEducations() {
    if (!isset($_POST['education']) || !is_array($_POST['education'])) {
        return [];
    }

    $educations = [];
    $sortBy = 1;

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

function getProjects($userId) {
    if (!isset($_POST['projects']) || !is_array($_POST['projects'])) {
        return [];
    }

    $projects = [];
    foreach ($_POST['projects'] as $index => $project) {
        if (!empty($project['projectTitle'])) {
            $projectImage = null;

            // ตรวจสอบการอัพโหลดรูปภาพโปรเจค
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

                $projectImage = handleImageUpload($projectFile, $userId, 'project');
            }

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

function handleImageUpload($file, $userID, $type = 'general') {
    if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
        return null;
    }

    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception('Invalid file type. Only JPG, PNG, and GIF are allowed.');
    }

    $maxSize = 10 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        throw new Exception('File size too large. Maximum size is 10MB.');
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $fileName = $type . '_' . uniqid() . '_' . time() . '.' . $extension;

    $uploadDir = 'uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $userDir = $uploadDir . $userID . '/';
    if (!is_dir($userDir)) {
        mkdir($userDir, 0755, true);
    }

    $uploadPath = $userDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        throw new Exception('Failed to upload file.');
    }

    return $uploadPath;
}

function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function insertPersonalData($conn, $data) {
    $sql = "INSERT INTO profile (
        firstName, lastName, position, email, phone, introContent
    ) VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $data['firstName'],
        $data['lastName'],
        $data['position'],
        $data['email'],
        $data['phone'],
        $data['introContent']
    ]);

    return $conn->lastInsertId();
}

function insertUserSkills($conn, $userId, $skills) {
    $sql = "INSERT INTO profileSkills (userID, skillsID) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);

    foreach ($skills as $skillId) {
        $stmt->execute([$userId, $skillId]);
    }
}

function insertWorkExperiences($conn, $userId, $experiences) {
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

function insertEducations($conn, $userId, $educations) {
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

function insertProjects($conn, $userId, $projects) {
    $projectSql = "INSERT INTO project (
        userID, projectTitle, projectImage, keyPoint
    ) VALUES (?, ?, ?, ?)";

    $projectSkillSql = "INSERT INTO project_skill (
        projectID, skillsID
    ) VALUES (?, ?)";

    $projectStmt = $conn->prepare($projectSql);
    $projectSkillStmt = $conn->prepare($projectSkillSql);

    foreach ($projects as $project) {
        $projectStmt->execute([
            $userId,
            $project['projectTitle'],
            $project['projectImage'],
            $project['keyPoint']
        ]);

        $projectId = $conn->lastInsertId();

        if (!empty($project['skills'])) {
            foreach ($project['skills'] as $skillId) {
                $projectSkillStmt->execute([$projectId, $skillId]);
            }
        }
    }
}
?>