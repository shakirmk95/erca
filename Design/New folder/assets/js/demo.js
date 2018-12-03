/**
 * demo.js
 * https://coidea.website
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, COIDEA
 * https://coidea.website
 */

class Slider {
  constructor(props) {
    this.rootElement = props.element;
    this.slides = Array.from(
      this.rootElement.querySelectorAll(".slider-list__item")
    );
    this.slidesLength = this.slides.length;
    this.current = 0;
    this.isAnimating = false;
    this.direction = 1; // -1
    this.baseAnimeSettings = {
      elasticity: 0,
      easing: 'easeInOutCirc'
    };
    this.baseAnimeSettingsForImg = {
    	scale: 0,
      duration: 350,
      easing: 'easeInOutCirc'
    };
    this.baseAnimeSettingsForHeadline = {
    	skewX: 0,
      duration: 175,
      easing: 'easeInOutCirc'
    };
    this.navBar = this.rootElement.querySelector(".slider__nav-bar");
    this.thumbs = Array.from(this.rootElement.querySelectorAll(".nav-control"));
    this.prevButton = this.rootElement.querySelector(".slider__arrow_prev");
    this.nextButton = this.rootElement.querySelector(".slider__arrow_next");

    this.slides[this.current].classList.add("slider-list__item_active");
    this.thumbs[this.current].classList.add("nav-control_active");
    
    // normalize image on start
    anime(Object.assign({}, self.baseAnimeSettingsForImg, {
      targets: this.slides[this.current].querySelectorAll('img'),
      scale: 1
    }));
    
    // normalize span on start
    anime(Object.assign({}, self.baseAnimeSettingsForHeadline, {
      targets: this.slides[this.current].querySelectorAll('span'),
      skewX: 0
    }));

    this._bindEvents();
  }

  goTo(index, dir) {
    if (this.isAnimating) return;
    var self = this;
    let prevSlide = this.slides[this.current];
    let nextSlide = this.slides[index];

    self.isAnimating = true;
    self.current = index;
    nextSlide.classList.add("slider-list__item_active");
    
    anime(Object.assign({}, self.baseAnimeSettingsForImg, {
      targets: this.slides[this.current].querySelectorAll('img'),
      scale: 0
    }));
    
    anime(Object.assign({}, self.baseAnimeSettingsForHeadline, {
      targets: this.slides[this.current].querySelectorAll('span'),
      skewX: 15
    }));

    anime(Object.assign({}, self.baseAnimeSettings, {
      targets: nextSlide,
      translateX: [100 * dir + '%', 0],
      complete: function(anim) {
      	// headline
        anime(Object.assign({}, self.baseAnimeSettingsForHeadline, {
          targets: prevSlide.querySelectorAll('span'),
          skewX: 15,
          complete: function(anim) {
            anime(Object.assign({}, self.baseAnimeSettingsForHeadline, {
              targets: nextSlide.querySelectorAll('span'),
              skewX: 15,
              complete: function(anim) {
              	anime(Object.assign({}, self.baseAnimeSettingsForHeadline, {
                  targets: nextSlide.querySelectorAll('span'),
                  skewX: 0
                }));  
              }
            }));
          }
        }));
      	// image
        anime(Object.assign({}, self.baseAnimeSettingsForImg, {
          targets: prevSlide.querySelectorAll('img'),
          scale: 0,
          complete: function(anim) {
            anime(Object.assign({}, self.baseAnimeSettingsForImg, {
              targets: nextSlide.querySelectorAll('img'),
              scale: 1
            }));
          }
        }));
      }
    }));

    anime(Object.assign({}, self.baseAnimeSettings, {
      targets: prevSlide,
      translateX: [0, -100 * dir + '%'],
      complete: function(anim) {
        self.isAnimating = false;
        prevSlide.classList.remove("slider-list__item_active");
        self.thumbs.forEach((item, index) => {
          var action = index === self.current ? "add" : "remove";
          item.classList[action]("nav-control_active");
          anime(Object.assign({}, self.baseAnimeSettingsForImg, {
            targets: prevSlide.querySelectorAll('img'),
            scale: 0
          }));
          anime(Object.assign({}, self.baseAnimeSettingsForHeadline, {
            targets: prevSlide.querySelectorAll('span'),
            skewX: 15
          }));
        });
      }
    }))
  }

  goStep(dir) {
    let index = this.current + dir;
    let len = this.slidesLength;
    let currentIndex = (index + len) % len;
    this.goTo(currentIndex, dir);
  }

  goNext() {
    this.goStep(1);
  }

  goPrev() {
    this.goStep(-1);
  }

  _navClickHandler(e) {
    var self = this;
    if (self.isAnimating) return;
    let target = e.target.closest(".nav-control");
    if (!target) return;
    let index = self.thumbs.indexOf(target);
    if (index === self.current) return;
    let direction = index > self.current ? 1 : -1;
    self.goTo(index, direction);
  }

  _bindEvents() {
    var self = this;
    ["goNext", "goPrev", "_navClickHandler"].forEach(method => {
      self[method] = self[method].bind(self);
    });
    self.nextButton.addEventListener("click", self.goNext);
    self.prevButton.addEventListener("click", self.goPrev);
    self.navBar.addEventListener("click", self._navClickHandler);
  }
}

// ===== init ======
let slider = new Slider({
  element: document.querySelector(".slider")
});