<?php
include('Finder.php');
include('Exception\FunderException.php');

use Funders\Finder;
use Funders\Exception\FunderException;

try {
    $finder = new Finder();
} catch (FunderException $funderException) {
    $result = [
        'status'  => 0,
        'message' => $funderException->getMessage(),
        'data'    => [],
    ];
    echo json_encode($result);
    exit(1);
}

$name = $_POST['name'];
$action = $_POST['action'];

$funders = $finder->getFunders();
switch ($action) {
    case 'suggestions':
        $data = $finder->getSuggestionNames($name);
        break;
    case 'search':
        $data = $finder->getFundersByName($name);
        break;
}

$result = [
    'status'  => 1,
    'message' => 'success',
    'data'    => $data,
];
echo json_encode($result);
exit(1);


