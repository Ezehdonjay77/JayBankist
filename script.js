'use strict';


const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');


///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};


btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////
// All information and coordinates of the scoll
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  //   )

  // making the transition smooth
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })

  // Modern Way of scrolling
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//    const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth'  })
//   })
// })

// Using Event Delegation
// 1. Add event listener to current parent element
// 2. Determine what element originated the event 

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab')
  console.log(clicked);

  //Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContents.forEach(tc => tc.classList.remove('operations__content--active'))

  // Active tab
  clicked.classList.add('operations__tab--active');

  console.log(clicked.dataset.tab);

  // Active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');


    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing an argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));


// // Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);


// window.addEventListener('scroll', function (e) {
//   console.log(this.window.scrollY);

//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Alternarive method of Sticky Navigation using the Intersection Observer API : this API allows our code to basically observe changes to the way a target element intersects another element or a viewport

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerobserever = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerobserever.observe(header);

// Revealing Sections
const revealSection = function (entries, observer) {
  entries.forEach(entry => {

    if (!entry.isIntersecting) return;
    else entry.target.classList.remove('section--hidden');

    observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});


// Lazy Loading Images
const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace the src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img')
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg,
  {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

imgTargets.forEach(img => imgObserver.observe(img)
);


// SLIDERS
const sliders = function () {

  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');


  let curSlide = 0;
  const maxSlide = slides.length;


  // Implementing dots
  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

  // Active Dots
  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
  };


  const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - curSlide)}%)`))
  }


  // Next slides
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  // Init Function
  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  }
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Implementing side arrow slides
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // dots 
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const { slide } = e.target.dataset;
      curSlide = Number(e.target.dataset.slide);
      goToSlide(curSlide);
      activateDots(curSlide);
    };
  });
};

sliders();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
// LECTURES

// Selecting, Creating and Deleting Elements
// 1. Selecting Documents
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// 2. Creating and Inserting Elements
// .insertAdjacentHTML is used to create movements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for functionality and analytics.';
message.innerHTML = 'We use cookies for functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

//header.prepend(message);
header.append(message); // This can be used to move the element.
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message)

// 3. Delete Elements
document.querySelector('.btn--close-cookie').
  addEventListener('click', function () {
    message.remove();
  });


// Styles, Attributes and Classes
//1. Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); // can not display anything cos we didnt set the color
console.log(message.style.backgroundColor); // get he background color we set ourselves

console.log(getComputedStyle(message).color); // used to get all the properties and values that we didnt even set
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle.height, 30) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered'); // can be used to change style of a page or selected property

// 2. Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalisit logo'

// Non - standard (so you cannot get it like the upper standard attributes)
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist')


// 2 different ways of getting the attributes
console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Special type called Data attribute(starts with the word data)
console.log(logo.dataset.versionNumber);

// 3. Classes( all the class functions)
logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Dont use this cos it will overwrite all the className
// logo.className = 'Jay'


// Event types and Even Handlers

// Mouse Enter Event
const h1 = document.querySelector('h1');

// modern method
// h1.addEventListener('mouseenter', function (e) {
//   alert('addEventListener: Great! you are reading the heading')
// });

// Old method
// h1.onmouseenter = function (e) {
//   alert('onmouseeneter: Great! you are reading the heading');
// };

// removing eventlisteners
const alertH1 = function (e) {
  alert('addEventListener: Great! you are reading the heading')
};

h1.addEventListener('mouseenter', alertH1);

// Removing it after it has been called
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);



// BUBBLING AND CAPTURING
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation stops it from going to the parent elements
  // e.stopPropagation();
});


document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});


document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});


// DOM Traversing
// This is walking through the Dom, meaning we select an element based on another element.
const h1 = document.querySelector('h1');

// Going downwards: child elements
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);// mostly not used cos it will display all nodes under h1
console.log(h1.children);// displays the main elements in h1(html collection)
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'purple';

// Going Upwards : Parents Element
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going Sideways: siblings
// we can only access direct siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
// we can effect changes directly on the sibling elements
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)'
});

*/

