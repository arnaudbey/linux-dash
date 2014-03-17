<?php

if (isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    $dirDefault = "./Widgets/Default";
    $dirUser = "./Widgets/User";
    switch ($action) {

        case 'getAllWidgets' :
            $files = glob('{'.$dirDefault.'/*.php,'.$dirUser.'/*.php}', GLOB_BRACE);
            $shortFiles = array();
            foreach ($files as $file) {
                $shortFiles[] = basename($file, ".php");
            }
            echo json_encode($shortFiles);
        break;

        case 'executeWidget':
            if (isset($_POST['widgetId']) && !empty($_POST['widgetId'])) {
                $widgetId = $_POST['widgetId'];
                $twig = loadTwig();
                if (is_file($dirDefault."/".$widgetId.".php")) {
                    require_once $dirDefault."/".$widgetId.".php";
                } else {
                    require_once $dirUser."/".$widgetId.".php";
                }
                echo $twig->render('widget.html.twig',array('widget' => $widget));
            }
        break;
    }
}

function loadTwig()
{
    require_once '../vendor/autoload.php';
    $loader = new Twig_Loader_Filesystem('../Resources/Views');
    $twig = new Twig_Environment($loader, array());

    return $twig;
}
