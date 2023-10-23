# Portfólio utils
### Um utilitário de portfólio de software em PHP.

Essa ferramenta foi escrita com a finalidade de disponibilizar
um link usado no web site, e uma sequência `html` que deve ser
chamada entre as tags `body` e antes de iniciar o conteudo do
web site.

A ideia desse projeto é chamar um script de título ou span ?
para cada pasta com um manual ou projetos que permita que o
visitante possa voltar a página inicial do web site.

### Como usar ?

Você pode usar o seguinte código `php` em qualquer página para
obter o link do site atual.

```php
<?= \Bwritec\PortfolioUtils\PortfolioUtils::get_host(); ?>
```

Exemplo:

```php
<a href="<?= \Bwritec\PortfolioUtils\PortfolioUtils::get_host(); ?>" title="Bwritec Portfólio">
    Bwritec Portfólio
</a>
```

A ferramenta também disponibiliza um método, que permite obter
um `html` formatado para que o visitante possa acessar as opções
disponível no website.

```php
<?= \Bwritec\PortfolioUtils\PortfolioUtils::get_ads(); ?>
```

Exemplo:

```php
<body>
    <?= \Bwritec\PortfolioUtils\PortfolioUtils::get_ads(); ?>

    ...
</body>
</html>
```
