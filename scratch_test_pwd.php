<?php
$password = 'password';
$hash = '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
if (password_verify($password, $hash)) {
    echo "OK: password matches hash\n";
} else {
    echo "FAIL: password does not match hash\n";
}

$password_admin = 'admin123';
if (password_verify($password_admin, $hash)) {
    echo "OK: admin123 matches hash\n";
} else {
    echo "FAIL: admin123 does not match hash\n";
}
?>
