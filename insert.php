<?php
require_once "config.php";

// header('Content-Type: application/json');

function validateRequiredImages()
{
    $requiredImages = ['logoImage', 'profileImage', 'coverImage'];

    foreach ($requiredImages as $imageField) {
        $ResultMsg = '';
        if (
            !isset($_FILES[$imageField]) ||
            $_FILES[$imageField]['error'] !== UPLOAD_ERR_OK ||
            !is_uploaded_file($_FILES[$imageField]['tmp_name'])
        ) {
            switch ($imageField) {
                case 'logoImage':
                    $ResultMsg = 'Please Upload your Logo Image';
                    break;
                case 'profileImage':
                    $ResultMsg = 'Please Upload your Profile Image';
                    break;
                case 'coverImage':
                    $ResultMsg = 'Please Upload your Cover Image';
                    break;
            }
            // throw new Exception($errorMessage);
        }
        return $ResultMsg;
    }
}

function handleImageUploads($userID)
{
    $images = [];

    if (isset($_FILES['logoImage']) && $_FILES['logoImage']['error'] === UPLOAD_ERR_OK) {
        $images['logoImage'] = handleImageUploadItem($_FILES['logoImage'], $userID, 'logo');
    }

    if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
        $images['profileImage'] = handleImageUploadItem($_FILES['profileImage'], $userID, 'profile');
    }

    if (isset($_FILES['coverImage']) && $_FILES['coverImage']['error'] === UPLOAD_ERR_OK) {
        $images['coverImage'] = handleImageUploadItem($_FILES['coverImage'], $userID, 'cover');
    }

    return $images;
}

function handleImageUploadItem($file, $userID, $type = 'general')
{
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


function updateImagesDB($conn, $userID, $images)
{
    $updates = [];
    $params = [];

    if (isset($images['logoImage'])) {
        $updates[] = "logoImage = ?";
        $params[] = $images['logoImage'];
    }
    if (isset($images['profileImage'])) {
        $updates[] = "profileImage = ?";
        $params[] = $images['profileImage'];
    }

    if (isset($images['coverImage'])) {
        $updates[] = "coverImage = ?";
        $params[] = $images['coverImage'];
    }

    if (!empty($updates)) {
        $params[] = $userID;
        $sql = "UPDATE profile SET " . implode(', ', $updates) . " WHERE UserID = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
    }
}


// Insert Round 1
try {

    $firstname = $_POST["firstname"];
    $lastname = $_POST["lastname"];
    $position = $_POST["position"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $facebook = $_POST["facebook"];
    $facebookUrl = $_POST["facebookUrl"];
    $introContent = $_POST["introContent"];

    $stmt = $conn->prepare("INSERT INTO profile (firstname, lastname, position, email, phone, facebook, facebookUrl, introContent)
        VALUES (:firstname, :lastname, :position, :email, :phone, :facebook, :facebookUrl, :introContent)");
    $stmt->bindParam(':firstname', $firstname);
    $stmt->bindParam(':lastname', $lastname);
    $stmt->bindParam(':position', $position);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':facebook', $facebook);
    $stmt->bindParam(':facebookUrl', $facebookUrl);
    $stmt->bindParam(':introContent', $introContent);

    if ($stmt->execute()) {
        $userID = $conn->lastInsertId();

        $validateResult =  validateRequiredImages();
        if ($validateResult != "") {
            throw new Exception($validateResult);
        }
        $imageUpdates = handleImageUploads($userID);
        if (!empty($imageUpdates)) {
            updateImagesDB($conn, $userID, $imageUpdates);
        }

        echo json_encode([
            "status" => "1",
            "message" => "New record created successfully",
            "userID" => $userID
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status" => "0",
        "message" => "Database error: " . $e->getMessage()
    ]);
}

// Insert Round 2