(function () {
  // MAIN SLIDER

  mainSlider = new Swiper(".main__slider", {
    spaceBetween: 100,
    initialSlide: 1,
    navigation: {
      nextEl: ".slider-control__icon_right",
      prevEl: ".slider-control__icon_left",
    },
  });

  // EVENTS SLIDER

  mainSlider = new Swiper(".events__slider", {
    loop: true,
    spaceBetween: 50,
    speed: 2000,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: ".events-controller__button--prev",
      prevEl: ".events-controller__button--next",
    },
    pagination: {
      el: ".events-pagination-bord",
    },
  });
})();
