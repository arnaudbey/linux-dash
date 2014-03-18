<?php

exec('/bin/grep -c ^processor /proc/cpuinfo', $resultNumberOfCores);
$numberOfCores = $resultNumberOfCores[0];

exec(
    '/bin/cat /proc/loadavg | /usr/bin/awk \'{print $1","$2","$3}\'',
    $resultLoadAvg
);
$loadAvg = explode(',', $resultLoadAvg[0]);

$load = array_map(
            function ($value, $numberOfCores) {
                return array($value, (int) ($value * 100 / $numberOfCores));
            },
            $loadAvg,
            array_fill(0, count($loadAvg), $numberOfCores)
        );

$content = $twig->render('Widgets/Default/loadAvg.html.twig',array("load" => $load));

$widget = array(
    "id" => basename(__FILE__, '.php'),
    "size" => "4",
    "icon" => "laptop",
    "title" => "Load Average",
    "content" => $content
);
