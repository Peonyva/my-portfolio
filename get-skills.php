<?php
require 'config.php';
header('Content-Type: application/json');

try {
    $stmt = $conn->query("SELECT skillsID as id, skillsName as name FROM skills ORDER BY name ASC");
    $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // ส่ง array เปล่าถ้าไม่มีข้อมูล
    echo json_encode($skills ?: []);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
