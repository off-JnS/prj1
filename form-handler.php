<?php
// Basic POST-only handler that appends submissions to submissions.csv
// and attempts to email the site owner. Supports PHPMailer if installed,
// otherwise falls back to PHP mail().

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

// Simple sanitization and limits
$name = substr(trim($_POST['name'] ?? ''), 0, 200);
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$message = substr(trim($_POST['message'] ?? ''), 0, 2000);

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$message) {
    header('Location: /PRJ1/?error=1');
    exit;
}

$safeMessage = str_replace(["\r", "\n"], [' ', ' '], $message);

// Append to CSV with flock
$csvPath = __DIR__ . '/submissions.csv';
$fp = fopen($csvPath, 'a');
if ($fp) {
    flock($fp, LOCK_EX);
    fputcsv($fp, [date('c'), $name, $email, $safeMessage]);
    flock($fp, LOCK_UN);
    fclose($fp);
}

// Email notification: prefer PHPMailer if available
$sent = false;
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    try {
        require __DIR__ . '/vendor/autoload.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        // --- Configure these SMTP settings for your email provider ---
        // Recommended: use your IONOS SMTP or Gmail (with App Password).
        // Replace SMTP_USER and SMTP_PASS below with real credentials.
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'SMTP_USER'; // e.g. your Gmail address or SMTP user
        $mail->Password = 'SMTP_PASS'; // e.g. app password for Gmail
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        // From address should be a domain you control for best deliverability
        $mail->setFrom('no-reply@yourdomain.com', 'PRJ1');
        $mail->addAddress('official.jns.on@gmail.com'); // your receiving email
        $mail->Subject = 'New contact form submission';
        $mail->Body = "Name: $name\nEmail: $email\n\n$safeMessage";
        $mail->send();
        $sent = true;
    } catch (Exception $e) {
        // silently continue to fallback
        $sent = false;
    }
} else {
    // Fallback to mail() — may be blocked or unreliable on some hosts
    $to = 'official.jns.on@gmail.com'; // your receiving email
    $subject = 'New contact form submission';
    $body = "Name: $name\nEmail: $email\n\n$safeMessage";
    $headers = "From: no-reply@yourdomain.com\r\nReply-To: $email\r\n";
    $sent = @mail($to, $subject, $body, $headers);
}

// Redirect back with a query flag for UI feedback
if ($sent) {
    header('Location: /PRJ1/?thanks=1');
} else {
    header('Location: /PRJ1/?submitted=1'); // submission saved even if email failed
}
exit;

?>
