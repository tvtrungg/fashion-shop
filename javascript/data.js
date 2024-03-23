document.addEventListener('DOMContentLoaded', () => {
  const articleContainer = document.getElementById('article-2');
  const showMoreBtn = document.querySelector('.show-more-btn');
  let categories = [];
  const menuList = document.getElementById('menu-list');
  const menuListMobile = document.getElementById('menu-list-mobile');

  fetch('../json/data.json')
    .then(response => response.json())
    .then(data => {
      data.menuItems.forEach(menuItem => {
        const li = document.createElement('li');
        li.className = 'navPages-item';
        const link = document.createElement('a');
        link.className = 'navPages-action';
        link.href = menuItem.link;
        link.innerHTML = `<span class="text">${menuItem.name}</span>`;
        if (menuItem.tag !== "") {
          const spanTag = document.createElement('span');
          spanTag.className = `navPages-label ${menuItem.tag}-label`;
          spanTag.textContent = menuItem.tag.charAt(0).toUpperCase() + menuItem.tag.slice(1);
          link.firstElementChild.appendChild(spanTag);
        }
        li.appendChild(link);
        menuList.appendChild(li);
        menuListMobile.appendChild(li.cloneNode(true));
      });
      categories = data.categories;
      fillInitialData();
      showMoreBtn.addEventListener('click', loadMoreData);


    });



  function fillInitialData() {
    for (let i = 0; i < 5; i++) {
      fillData(categories[i]);
    }
    attachEventListeners();
  }

  function loadMoreData() {
    for (let i = 5; i < categories.length; i++) {
      fillData(categories[i]);
    }
    showMoreBtn.style.display = 'none';
    attachEventListeners();
  }

  function fillData(category) {
    const articleItem = document.createElement('div');
    articleItem.className = 'article-2-item col-xxl-20 col-xl-4 col-md-6 col-12 p-3';
    articleItem.innerHTML = `
      <div class="article-2-item-image">
        <img src="${category.imageSrc}" alt="${category.productName}" />
        <div class="cart-btn">
          <button class="add-cart-btn">Add to Cart</button>
        </div>
        <div class="cart-btn-submit">
          <div class="size-wrapper">
            <span>Size:</span>
            X
            <div class="article-2-item-action size-content">
              ${category.sizes.map(size => `<label><span class="btn-size">${size}</span></label>`).join('')}
            </div>
          </div>
          <button class="submit-btn">Submit</button>
        </div>
      </div>
      <div class="article-2-item-content">
        <h3 class="article-2-item-status">${category.productStatus}</h3>
        <h3 class="article-2-item-title">${category.productName}</h3>
        <p class="article-2-item-price">${category.productPrice}</p>
        <div class="article-2-item-action">
          ${category.colors.slice(0, 3).map(color => `<label><span class="btn-circle color" style="background-color: ${color}"></span></label>`).join('')}
          ${category.colors.length > 3 ? `<span class="btn-circle-quantity">+${category.colors.length - 3}</span>` : ''}
        </div>
        <button class="add-wish-list"><i class="fa-regular fa-heart"></i></button>
        <button class="see-full"><i class="fa-regular fa-eye"></i></button>
        <button class="close-btn"><i class="fa-solid fa-xmark"></i></button>
      </div>`;
    articleContainer.appendChild(articleItem);
  }


  function CarouselFunction(autoplay) {
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const slideWidth = slides[0].offsetWidth;
    const slidesToShow = 5;
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let autoplayInterval;

    // Function to move to the previous slide
    function prevSlide() {
      if (currentIndex === 0) {
        currentIndex = slides.length - slidesToShow;
      } else {
        currentIndex = Math.max(0, currentIndex - 1);
      }
      updateCarousel();
    }

    // Function to move to the next slide
    function nextSlide() {
      if (currentIndex === slides.length - slidesToShow) {
        currentIndex = 0;
      } else {
        currentIndex = Math.min(slides.length - slidesToShow, currentIndex + 1);
      }
      updateCarousel();
    }

    // Function to update carousel position
    function updateCarousel() {
      slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    // Add click event listeners to prev and next buttons
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Swipe to slide functionality
    slidesContainer.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.clientX;
    });

    slidesContainer.addEventListener('mouseup', () => {
      isDragging = false;
      const endX = startX - e.clientX;
      if (endX > 100) {
        nextSlide();
      } else if (endX < -100) {
        prevSlide();
      }
    });

    slidesContainer.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    slidesContainer.addEventListener('mousemove', e => {
      if (isDragging) {
        const currentPosition = e.clientX;
        const distance = startX - currentPosition;
        slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth + distance}px)`;
      }
    });

    // Prevent default behavior for mouse down event to avoid text selection
    slidesContainer.addEventListener('mousedown', e => e.preventDefault());

    // Swipe functionality for touch devices
    slidesContainer.addEventListener('touchstart', e => {
      isDragging = true;
      startX = e.touches[0].clientX;
    });

    slidesContainer.addEventListener('touchend', e => {
      isDragging = false;
      const endX = startX - e.changedTouches[0].clientX;
      if (endX > 100) {
        nextSlide();
      } else if (endX < -100) {
        prevSlide();
      }
    });

    slidesContainer.addEventListener('touchmove', e => {
      if (isDragging) {
        const currentPosition = e.touches[0].clientX;
        const distance = startX - currentPosition;
        slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth + distance}px)`;
      }
    });

    // Autoplay functionality
    if (autoplay) {
      autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    }

    // Pause autoplay when mouse hovers over the carousel
    slidesContainer.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });

    // Resume autoplay when mouse leaves the carousel
    slidesContainer.addEventListener('mouseleave', () => {
      if (autoplay) {
        autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
      }
    });
  }


  const carouselElements = document.querySelectorAll('.carousel-custom');

  carouselElements.forEach(carouselElement => {
    const autoplayValue = carouselElement.dataset.autoplay === 'true'; // Convert string to boolean
    CarouselFunction(autoplayValue);
  });

  function attachEventListeners() {
    const addCartBtns = document.querySelectorAll('.add-cart-btn');
    const cartBtns = document.querySelectorAll('.cart-btn');
    const cartBtnSubmit = document.querySelectorAll('.cart-btn-submit');
    const seeFulls = document.querySelectorAll('.see-full');
    const submitBtns = document.querySelectorAll('.submit-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const closePromotion = document.querySelector('.banner-promotion-close');
    const bannerPromotion = document.querySelector('.banner-promotion');
    const backToTop = document.getElementById('back-to-top');
    const headerMobile = document.querySelector('.header-mobile');
    const exitIcon = document.querySelector('.exit-icon');
    const navPagesItems = document.querySelectorAll('.navPages-item');
    const barIcon = document.querySelector('.bar-icon');
    const body = document.querySelector('body');
    const footerLists = document.querySelectorAll('.footer-list');
    const footerShop = document.getElementById('footer-section-shop')
    const footerInformation = document.getElementById('footer-section-information')
    const footerCustomerService = document.getElementById('footer-section-customerService')
    const article1 = document.querySelector('#article-1');
    const article2 = document.querySelector('#article-2');
    const article3 = document.querySelector('#article-3');

    function checkPosition() {
      const sections = [
        { element: article1, animationClass: 'animate__fadeInUp' },
        { element: article2, animationClass: 'animate__fadeInLeft' },
        { element: article3, animationClass: 'animate__flipInX' }
      ];

      const windowHeight = window.innerHeight;

      sections.forEach(section => {
        const positionFromTop = section.element.getBoundingClientRect().top;

        if (positionFromTop - windowHeight <= 0) {
          section.element.classList.add(section.animationClass);
        }
      });
    }

    checkPosition();
    window.addEventListener('scroll', checkPosition);


    function toggleFooterList(footerList) {
      if (window.innerWidth < 572) {
        footerList.classList.toggle('show');
        const footerSection = footerList.parentElement;
        const icon = footerSection.querySelector('i');
        footerSection.classList.toggle('show');
        const isShowing = footerSection.classList.contains('show');

        if (!isShowing) {
          icon.classList.remove('fa-chevron-up');
          icon.classList.add('fa-chevron-down');
        } else {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-up');
        }
      }
    }

    footerShop.addEventListener('click', function () {
      toggleFooterList(footerLists[0]);
    });

    footerInformation.addEventListener('click', function () {
      toggleFooterList(footerLists[1]);
    });

    footerCustomerService.addEventListener('click', function () {
      toggleFooterList(footerLists[2]);
    });


    addCartBtns.forEach((addCartBtn, index) => {
      addCartBtn.addEventListener('click', () => {
        cartBtns[index].classList.add('hidden');
        cartBtnSubmit[index].classList.add('show');
        closeBtns[index].classList.add('show');
        seeFulls[index].classList.add('show');
      });
    });

    [closeBtns, submitBtns].forEach(btns => {
      btns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          cartBtns[index].classList.remove('hidden');
          cartBtnSubmit[index].classList.remove('show');
          closeBtns[index].classList.remove('show');
          seeFulls[index].classList.remove('show');
        });
      });
    });

    closePromotion.addEventListener('click', () => {
      bannerPromotion.remove();
    });

    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.pageYOffset > 300);
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    barIcon.addEventListener('click', () => {
      headerMobile.classList.add('show');
      headerMobile.classList.add('animate__slideInLeft');
      headerMobile.classList.remove('animate__slideOutLeft');
      body.style.overflow = 'hidden';
    });

    exitIcon.addEventListener('click', () => {
      headerMobile.classList.remove('animate__slideInLeft');
      headerMobile.classList.add('animate__slideOutLeft');
      body.style.overflow = '';
    });

    navPagesItems.forEach(navPagesItem => {
      navPagesItem.addEventListener('click', () => {
        headerMobile.classList.remove('animate__slideInLeft');
        headerMobile.classList.add('animate__slideOutLeft');
        body.style.overflow = '';
      });
    }
    );
  }
});
