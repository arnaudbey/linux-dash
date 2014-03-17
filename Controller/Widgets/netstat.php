<?php

/* this section finds command paths from OS */
$netstat = exec("command -v netstat");
$awk = exec("command -v awk");
$sort = exec("command -v sort");
$uniq = exec("command -v uniq");

/* execute command */
exec("$netstat -ntu | $awk 'NR>2 {sub(/:[^:]+$/, \"\"); print $5}' | $sort | $uniq -c", $result);

$ips = array();
$max = count($result);
for ($i = 0; $i < $max; $i++) {

   $ips[] = preg_split(
        '@\s+@',
        $result[$i],
        null,
        PREG_SPLIT_NO_EMPTY
    );
}

$content = $twig->render('Widgets/netstat.html.twig',array("ips" => $ips));

$widget = array(
    "id" => basename(__FILE__, '.php'),
    "size" => "3",
    "title" => "Network Statistics",
    "content" => $content
);
