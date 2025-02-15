<?php 

require './config/db.php';

$page = 1;

if (isset($_GET['page'])) {
  $page = (int)$_GET['page'];
}

$count = 21;
$offset = $count * ($page - 1);

$sql = "SELECT * FROM news ORDER BY date DESC LIMIT :count OFFSET :offset";

$statement = $pdo->prepare($sql);
$statement->bindParam(':count', $count, PDO::PARAM_INT);
$statement->bindParam(':offset', $offset, PDO::PARAM_INT);  

$statement->execute();
$posts = $statement->fetchAll(PDO::FETCH_ASSOC);

// calculate count for pagination
$sql = "SELECT COUNT(*) AS count FROM news";
$statement = $pdo->prepare($sql);
$statement->execute();
$result = $statement->fetch(PDO::FETCH_ASSOC);
$totalCount = $result['count'];

$totalPages = ceil($totalCount / $count);
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="shortcut icon" href="olimp.png" type="image/png" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="МБУ СК Олимп - центр спортивной жизни в Краснопахорском поселении. Большой выбор спортивных секций от велогонок BMX до шахмат. Профессиональные трененра, современные залы и площадки для занятий спортом."
    />
    <link rel="apple-touch-icon" href="olimp.png" />
    <link rel="manifest" href="manifest.json" />
    <title>Спортивный Клуб Олимп</title>
    <link href="style.css" rel="stylesheet" />
    <style type="text/css">
      .transform-component-module_wrapper__1_Fgj {
        position: relative;
        width: -moz-fit-content;
        width: fit-content;
        height: -moz-fit-content;
        height: fit-content;
        overflow: hidden;
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        margin: 0;
        padding: 0;
      }
      .transform-component-module_content__2jYgh {
        display: flex;
        flex-wrap: wrap;
        width: -moz-fit-content;
        width: fit-content;
        height: -moz-fit-content;
        height: fit-content;
        margin: 0;
        padding: 0;
        transform-origin: 0% 0%;
      }
      .transform-component-module_content__2jYgh img {
        pointer-events: none;
      }
    </style>
  </head>
  <body class="">
    <div id="root">
      <div class="header">
        <div class="header__body">
            <div class="header-desctop">
            <div class="header-desctop__top _container">
              <div class="header-descriptor">
                <span class="header-descriptor__text text-small"
                  >Центр спортивной жизни в Краснопахоском</span
                >
              </div>
              <div class="header-desctop-logo">
                <a class="header-desctop-logo__link" href="/"
                  ><img
                    class="header-desctop-logo__link_ico"
                    src="img/olimpMainIcon.3055bfb1.svg"
                    alt="icon"
                /></a>
              </div>
              <div class="header-info">
                <div class="header-info__body">
                  <ul class="header-info__list">
                    <li class="header-info-item">
                      <div class="header-info-item__body">
                        <div class="header-info-item__icon">
                          <svg
                            class="icon icon-phone undefined"
                            fill="#fff"
                            width="22"
                            height="22"
                          >
                            <use
                              xlink:href="img/iconsSprite.1a5b525d.svg#icon-phone"
                            ></use>
                          </svg>
                        </div>
                        <a
                          href="tel:+74958508389"
                          class="header-info-item__value"
                          ><span class="header-info-item__value_text text-small"
                            >+7 495 850-83-89</span
                          ></a
                        >
                      </div>
                    </li>
                    <li class="header-info-item">
                      <div class="header-info-item__body">
                        <div class="header-info-item__icon">
                          <svg
                            class="icon icon-mail undefined"
                            fill="#fff"
                            width="22"
                            height="22"
                          >
                            <use
                              xlink:href="img/iconsSprite.1a5b525d.svg#icon-mail"
                            ></use>
                          </svg>
                        </div>
                        <a
                          href="mailto:Olimp.post@inbox.ru"
                          class="header-info-item__value"
                          ><span class="header-info-item__value_text text-small"
                            >Olimp.post@inbox.ru</span
                          ></a
                        >
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="header-desctop__bottom">
              <div class="navigation">
                <div class="navigation__body">
                  <div class="navigation__content _container">
                    <ul class="nav-list">
                      <li class="nav-list-item">
                        <a class="nav-list-item__link" href="about.html"
                          ><div class="nav-list-item__content">
                            <span class="nav-list-item__content_name nav-font"
                              >О НАС</span
                            >
                          </div></a
                        >
                      </li>
                      <li class="nav-list-item">
                        <a class="nav-list-item__link" href="sections.html"
                          ><div class="nav-list-item__content">
                            <span class="nav-list-item__content_name nav-font"
                              >СЕКЦИИ</span
                            >
                          </div></a
                        >
                      </li>
                      <li class="nav-list-item">
                        <a class="nav-list-item__link" href="news.php"
                          ><div class="nav-list-item__content">
                            <span class="nav-list-item__content_name nav-font"
                              >НОВОСТИ</span
                            >
                          </div></a
                        >
                      </li>
                      <li class="nav-list-item">
                        <a class="nav-list-item__link" href="past-events.html"
                          ><div class="nav-list-item__content">
                            <span class="nav-list-item__content_name nav-font"
                              >МЕРОПРИЯТИЯ</span
                            >
                          </div></a
                        >
                      </li>
                      <li class="nav-list-item">
                        <a class="nav-list-item__link" href="places.html"
                          ><div class="nav-list-item__content">
                            <span class="nav-list-item__content_name nav-font"
                              >ПРОСТРАНСТВА</span
                            >
                          </div></a
                        >
                      </li>
                     <li class="nav-list-item">
                        <a class="nav-list-item__link" href="index.html"
                          ><div class="nav-list-item__content">
                            <span class="nav-list-item__content_name nav-font"
                              >УСЛУГИ</span
                            >
                          </div></a
                        >
                      </li>
                      <li class="nav-list-item">
                        <a class="nav-list-item__link" href="contacts.html"
                          ><div class="nav-list-item__content">
                            <span class="nav-list-item__content_name nav-font"
                              >КОНТАКТЫ</span
                            >
                          </div></a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="news _wrapper">
        <div class="news__body">
          <div class="news-preview">
            <div class="news-preview__body _container">
              <div class="preview">
                <div class="preview__body">
                  <div class="preview-info">
                    <div
                      class="preview-info__title"
                      style="background: rgb(0, 81, 189)"
                    >
                      <div class="preview-info__title_body">
                        <span
                          class="preview-info__title_text title-huge"
                          style="
                            color: rgb(255, 255, 255);
                            text-shadow: rgb(0, 0, 0) 1px 1px 1px;
                          "
                          >Новости</span
                        >
                      </div>
                    </div>
                    <div class="preview-info__subtitle">
                      <span
                        class="preview-info__subtitle_text text-medium"
                        style="color: rgb(0, 0, 0)"
                        >Ниже представлен список новостей МБУ СК Олимп. В нём
                        хранятся самые яркие события связанные с жизнью нашего
                        спортивного клуба. Новости с соревнований, посты о
                        тренерах и их подопечных, спортивные события поселения
                        Краснопахорское и многое другое вы сможете найти
                        ниже.</span
                      >
                    </div>
                  </div>
                  <div class="preview-icon">
                    <svg class="icon icon-news preview-icon__ico" fill="#000">
                      <use
                        xlink:href="img/iconsSprite.1a5b525d.svg#icon-news"
                      ></use>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="news-content _container">
            <ul class="news-list">
              <?php foreach ($posts as $post) { ?>
              <li class="main-news-list__item main-news-item">
                <div class="main-news-item__decoration">
                  <div
                    class="main-news-item__decoration_img"
                    style="
                      background-image: url('<?php echo 'img/' . $post['image'] ?>');
                    "
                  ></div>
                </div>
                <div class="main-news-item__info">
                  <div class="main-news-item__info_title">
                    <span class="title-small"
                      ><?php echo $post['title'] ?></span
                    >
                  </div>
                  <div class="main-news-item__info_text">
                    <span class="text-small"
                      ><?php echo $post['content'] ?></span
                    >
                  </div>
                  <div class="main-news-item__info_date">
                    <svg
                      class="icon icon-calendar undefined"
                      fill="#0051bd"
                      width="25"
                      height="25"
                    >
                      <use
                        xlink:href="img/iconsSprite.1a5b525d.svg#icon-calendar"
                      ></use>
                    </svg>
                    <p class="main-news-item__info_date-title text-small">
                      Дата публикации:
                    </p>
                    <span class="main-news-item__info_date-number text-small"
                      ><?php echo (new DateTime($post['date']))->format("d. m. Y") ?></span
                    >
                  </div>
                </div>
              </li>
              <?php } ?>
            </ul>
          </div>
          <div class="news-pagination">
            <div class="pagination _container">
              <div class="pagination__body">
                <ul class="pagination-list">
                  <?php for ($i = 1; $i <= $totalPages; $i++) { ?>
                  <a class="pagination-list__item<?php echo $page === $i ? ' pagination-item-active': '' ?>" href="./news.php?page=<?php echo $i ?>"
                    ><span class="pagination-list__item_value title-small"
                      ><?php echo $i ?></span
                    ></a
                  >
                  <?php } ?>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="footer">
        <div class="footer__body _container">
          <div class="footer-main">
            <ul class="footer-main__list">
              <li class="footer-item">
                <div class="footer-item__body">
                  <a class="footer-item__link"  href="about.html"
                    ><span class="footer-item__link_name nav-font"
                      >О НАС</span
                    ></a
                  >
                  <ul class="footer-item__list">
                    <li class="footer-list-item">
                      <a class="footer-list-item__link"  href="documents.html"
                        ><span class="footer-list-item__link_text text-medium"
                          >Документы</span
                        ></a
                      >
                    </li>
                    <li class="footer-list-item">
                      <a class="footer-list-item__link" href="/"
                        ><span class="footer-list-item__link_text text-medium"
                          >Независимая оценка</span
                        ></a
                      >
                    </li>
                    <li class="footer-list-item">
                      <a class="footer-list-item__link"  href="news.php"
                        ><span class="footer-list-item__link_text text-medium"
                          >Новости</span
                        ></a
                      >
                    </li>
                    <li class="footer-list-item">
                      <a class="footer-list-item__link"  href="index.html"
                        ><span class="footer-list-item__link_text text-medium"
                          >Услуги</span
                        ></a
                      >
                    </li>
                  </ul>
                </div>
              </li>
              <li class="footer-item">
                <div class="footer-item__body">
                  <a class="footer-item__link"  href="sections.html"
                    ><span class="footer-item__link_name nav-font"
                      >СЕКЦИИ</span
                    ></a
                  >
                  <ul class="footer-item__list">
                    <li class="footer-list-item">
                      <a
                        class="footer-list-item__link"
                         href="football.html"
                        ><span class="footer-list-item__link_text text-medium"
                          >Футбол</span
                        ></a
                      >
                    </li>
                    <li class="footer-list-item">
                      <a
                        class="footer-list-item__link"
                         href="voleyball.html"
                        ><span class="footer-list-item__link_text text-medium"
                          >Волейбол</span
                        ></a
                      >
                    </li>
                    <li class="footer-list-item">
                      <a class="footer-list-item__link"  href="bmx.html"
                        ><span class="footer-list-item__link_text text-medium"
                          >BMX</span
                        ></a
                      >
                    </li>
                    <li class="footer-list-item">
                      <a class="footer-list-item__link"  href="sections.html"
                        ><span class="footer-list-item__link_text text-medium"
                          >Все секции</span
                        ></a
                      >
                    </li>
                  </ul>
                </div>
              </li>
              <li class="footer-item">
                <div class="footer-item__body">
                  <a class="footer-item__link"  href="contacts.html"
                    ><span class="footer-item__link_name nav-font"
                      >КОНТАКТЫ</span
                    ></a
                  >
                  <ul class="footer-item__list">
                    <li class="footer-list-item">
                      <a
                        class="footer-list-item__media-link text-medium"
                        href="tel:+74958508389"
                        >Телефон: + 7 495 850-83-89</a
                      >
                    </li>
                    <li class="footer-list-item">
                      <p class="footer-list-item__text text-medium">
                        108828 г.Москва,п.Краснопахорское, с.Красная Пахра, 11
                      </p>
                    </li>
                    <li class="footer-list-item">
                      <p class="footer-list-item__text text-medium">
                        Ежедневно с 09:00 до 22:00
                      </p>
                    </li>
                    <li class="footer-list-item">
                      <a
                        class="footer-list-item__media-link text-medium"
                        href="mailto:Olimp.post@inbox.ru"
                        >Почта: Olimp.post@inbox.ru</a
                      >
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div class="footer-bottom">
            <div class="footer-networks">
              <div class="networks">
                <div class="networks__body">
                  <ul class="networks-list">
                    <li class="networks-list-item">
                      <a
                        href="https://vk.com/public203484259"
                        class="networks-list-item__link"
                        target="_blank"
                        rel="noopener noreferrer"
                        ><div class="networks-list-item__icon">
                          <svg
                            class="icon icon-vk networks-list-item__icon_ico"
                            width="40"
                            height="40"
                          >
                            <use
                              xlink:href="img/iconsSprite.1a5b525d.svg#icon-vk"
                            ></use>
                          </svg></div
                      ></a>
                    </li>
                    <li class="networks-list-item">
                      <a
                        href="mailto:Olimp.post@inbox.ru"
                        class="networks-list-item__link"
                        ><div class="networks-list-item__icon">
                          <svg
                            class="icon icon-mail networks-list-item__icon_ico"
                            width="40"
                            height="40"
                          >
                            <use
                              xlink:href="img/iconsSprite.1a5b525d.svg#icon-mail"
                            ></use>
                          </svg></div
                      ></a>
                    </li>
                    <li class="networks-list-item">
                      <a
                        href="tel:+74958508389"
                        class="networks-list-item__link"
                        ><div class="networks-list-item__icon">
                          <svg
                            class="icon icon-phone networks-list-item__icon_ico"
                            width="35"
                            height="35"
                          >
                            <use
                              xlink:href="img/iconsSprite.1a5b525d.svg#icon-phone"
                            ></use>
                          </svg></div
                      ></a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="footer-logo">
              <div class="footer-logo__body">
                <img
                  src="img/olimpMainIcon.3055bfb1.svg"
                  alt="olimp"
                  class="footer-logo__body_img"
                />
              </div>
            </div>
            <div class="footer-copyrights">
              <div class="footer-copyrights__body">
                <svg
                  class="icon icon-copyright undefined"
                  fill="#3b3b3b"
                  width="17"
                  height="17"
                >
                  <use
                    xlink:href="img/iconsSprite.1a5b525d.svg#icon-copyright"
                  ></use>
                </svg>
                <p class="footer-copyrights__text">2000-2023 МБУК СК Олимп</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <script src="static\js\2.df52f1c4.chunk.js"></script>
    <script src="static\js\main.8514d060.chunk.js"></script>
  </body>
</html>
