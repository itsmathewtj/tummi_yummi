(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });

    const initializeAutoScroller = function (scrollerSelector, trackSelector, options = {}) {
        const scroller = document.querySelector(scrollerSelector);
        const track = scroller ? scroller.querySelector(trackSelector) : null;

        if (!scroller || !track || track.children.length === 0) {
            return;
        }

        const settings = {
            cloneTrack: false,
            speed: 0.6,
            ...options
        };

        if (settings.cloneTrack) {
            track.innerHTML += track.innerHTML;
        }

        scroller.classList.add('is-auto-scrolling');

        let isPaused = false;
        let scrollResetPoint = track.scrollWidth / 2;
        let isPointerDown = false;
        let dragStartX = 0;
        let dragStartScrollLeft = 0;

        const syncResetPoint = function () {
            scrollResetPoint = track.scrollWidth / 2;
        };

        const autoScroll = function () {
            if (!isPaused) {
                scroller.scrollLeft += settings.speed;

                if (scroller.scrollLeft >= scrollResetPoint) {
                    scroller.scrollLeft = 0;
                }
            }

            window.requestAnimationFrame(autoScroll);
        };

        scroller.addEventListener('mouseenter', function () {
            isPaused = true;
        });

        scroller.addEventListener('mouseleave', function () {
            isPaused = false;
        });

        scroller.addEventListener('touchstart', function () {
            isPaused = true;
        }, { passive: true });

        scroller.addEventListener('touchend', function () {
            isPaused = false;
        }, { passive: true });

        scroller.addEventListener('pointerdown', function (event) {
            isPointerDown = true;
            isPaused = true;
            dragStartX = event.clientX;
            dragStartScrollLeft = scroller.scrollLeft;
            scroller.classList.add('is-dragging');
        });

        scroller.addEventListener('pointermove', function (event) {
            if (!isPointerDown) {
                return;
            }

            const distance = event.clientX - dragStartX;
            scroller.scrollLeft = dragStartScrollLeft - distance;
        });

        const stopDragging = function () {
            if (!isPointerDown) {
                return;
            }

            isPointerDown = false;
            isPaused = false;
            scroller.classList.remove('is-dragging');
        };

        scroller.addEventListener('pointerup', stopDragging);
        scroller.addEventListener('pointercancel', stopDragging);
        scroller.addEventListener('pointerleave', stopDragging);

        window.addEventListener('resize', syncResetPoint);
        syncResetPoint();
        window.requestAnimationFrame(autoScroll);
    };

    // Blog auto scroll
    initializeAutoScroller('.blog-scroll', '.blog-scroll-track', {
        cloneTrack: true,
        speed: 0.6
    });

    // Testimonial auto scroll
    initializeAutoScroller('.testimonial-slider', '.testimonial-track', {
        speed: 0.55
    });

    const initializeMenuFilter = function () {
        const filterButtons = document.querySelectorAll('.menu-filter-btn');
        const tabTriggers = document.querySelectorAll('[data-bs-toggle="pill"]');

        if (!filterButtons.length) {
            return;
        }

        let activeFilter = 'all';

        const applyFilter = function () {
            const activePane = document.querySelector('.menu-tab-content .tab-pane.active');

            if (!activePane) {
                return;
            }

            const items = activePane.querySelectorAll('.menu-filter-item');

            items.forEach(function (item) {
                const itemCategories = (item.dataset.menuCategory || '').split(/\s+/).filter(Boolean);
                const shouldShow = activeFilter === 'all' || itemCategories.includes(activeFilter);
                item.classList.toggle('is-hidden', !shouldShow);
            });
        };

        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeFilter = button.dataset.menuFilter || 'all';

                filterButtons.forEach(function (item) {
                    item.classList.remove('active');
                });

                button.classList.add('active');
                applyFilter();
            });
        });

        tabTriggers.forEach(function (trigger) {
            trigger.addEventListener('shown.bs.tab', function () {
                applyFilter();
            });
        });

        applyFilter();
    };

    initializeMenuFilter();

    const initializeMobileQuickPanel = function () {
        const panel = document.getElementById('mobileQuickPanel');
        const toggle = document.getElementById('mobileQuickToggle');

        if (!panel || !toggle) {
            return;
        }

        const syncState = function (isOpen) {
            panel.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        };

        syncState(false);

        toggle.addEventListener('click', function () {
            syncState(!panel.classList.contains('is-open'));
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 575.98) {
                syncState(false);
            }
        });
    };

    initializeMobileQuickPanel();
    
})(jQuery);

