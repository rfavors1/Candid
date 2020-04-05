<?php
namespace Funders;

use Funders\Exception\FunderException;

class Finder
{
    /** @var array */
    protected $funders;

    public function __construct()
    {
        $this->funders = $this->getFunderData();
    }

    public function getFunderData(): array
    {
        $data = file_get_contents('https://maps.foundationcenter.org/api/hip/getTopFunders.php?apiKey=3A50C1D7-82FB-425C-92F1-5B2922288DA7&end_year=2017&top=500');
        $funders = json_decode($data, true);
        if ($funders['code'] !== 200) {
            throw new FunderException($funders['status']);
        }

        return $funders['data']['results']['rows'];
    }

    public function getFunders(): array
    {
        return $this->funders;
    }

    public function getFundersByName(string $name): array
    {
        $funders = $this->getFunders();

        if ($name === '') {
            return $funders;
        }

        $results = array_filter($funders, function ($funder) use ($name) {
            return stripos($funder['name'], $name) !== false;
        });

        return $results;
    }

    public function getSuggestionNames(string $name): array
    {
        $results = $this->getFundersByName($name);
        $results = array_splice($results, 0, 5);
        $results = array_column($results, 'name');

        return $results;
    }
}
