<?php
$host = '127.0.0.1';
$port = 3008;

$server = stream_socket_server("tcp://$host:$port", $errno, $errstr);

if (!$server) {
    die("Failed to create server: $errstr ($errno)\n");
}

echo "Server running at http://$host:$port/\n";

while ($conn = stream_socket_accept($server, -1)) {
    $request = fread($conn, 1024);
    
    $response = "HTTP/1.1 200 OK\r\n";
    $response .= "Content-Type: text/plain\r\n";
    $response .= "Connection: close\r\n";
    $response .= "\r\n";
    $response .= "Hello World";
    
    fwrite($conn, $response);
    fclose($conn);
}

fclose($server);
