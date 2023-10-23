<?php

    include __DIR__ . "/src/PortfolioUtils.php";

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Olá mundo</title>
</head>
<body>

    <!--
      - substr - apénas para formatação da saída html. ignora os
      - primeiro 4 espaços.
     -->
    <?= substr(\Bwritec\PortfolioUtils\PortfolioUtils::get_ads(), 4) ?>

    <h1>
        Olá mundo !
    </h1>

    <p>
        Um exemplo de website.
    </p>

</body>
</html>
