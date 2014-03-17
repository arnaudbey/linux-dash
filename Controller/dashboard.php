<?php

if (isset($_POST['action']) && !empty($_POST['action'])) {
    $action = $_POST['action'];
    switch ($action) {

        case 'getAllWidgets' :
            $files = glob('Widgets/*.php', GLOB_BRACE);
            echo json_encode($files);
        break;

        case 'executeWidget':
            if (isset($_POST['widgetFile']) && !empty($_POST['widgetFile'])) {
                $twig = loadTwig();
                require_once $_POST['widgetFile'];
                echo $twig->render('widget.html.twig',array('widget' => $widget));
            }
        break;

        case 'refreshWidget':
            if (isset($_POST['widgetId']) && !empty($_POST['widgetId'])) {
                $twig = loadTwig();
                require_once './Widgets/'.$_POST['widgetId'].".php";
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
