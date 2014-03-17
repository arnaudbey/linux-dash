<?php

// Read list of hosts to ping from csv file ping_hosts
if (file_exists("ping_hosts")) {
    $hosts = file('ping_hosts', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
} else {
    $hosts = array("gnu.org", "github.com", "wikipedia.org");
}

$pingCount = 1;
$max = count($hosts);

$pings = array();
for ($i = 0; $i < $max; $i++) {
    $result = array();
    exec(
        "/bin/ping -qc {$pingCount} {$hosts[$i]} |" .
        " awk -F/ '/^rtt/ { print $5 }'",
        $result
    );
    $pings[] = array("host" => $hosts[$i], "latency" => $result[0]);
}

$content = $twig->render('Widgets/Default/ping.html.twig',array("pings" => $pings));

$widget = array(
    "id" => basename(__FILE__, '.php'),
    "size" => "3",
    "title" => "Ping",
    "content" => $content
);
