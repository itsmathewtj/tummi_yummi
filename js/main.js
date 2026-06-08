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
        const filterButtons = document.querySelectorAll('.menu-filter-btn, .mobile-menu-filter-btn');
        const tabTriggers = document.querySelectorAll('[data-bs-toggle="pill"]');

        if (!filterButtons.length) {
            return;
        }

        let activeFilter = 'all';

        const applyFilter = function () {
            const items = document.querySelectorAll('.menu-tab-content .menu-filter-item');

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
                    item.classList.toggle('active', (item.dataset.menuFilter || 'all') === activeFilter);
                });

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

    const initializeMobileMenuFilter = function () {
        const panel = document.getElementById('mobileMenuFilter');
        const toggle = document.getElementById('mobileMenuFilterToggle');
        const list = document.getElementById('mobileMenuFilterList');

        if (!panel || !toggle || !list) {
            return;
        }

        let pointerId = null;
        let offsetX = 0;
        let offsetY = 0;
        let startX = 0;
        let startY = 0;
        let hasDragged = false;

        const isMobile = function () {
            return window.matchMedia('(max-width: 575.98px)').matches;
        };

        const syncState = function (isOpen) {
            panel.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Hide menu categories' : 'Show menu categories');
            list.setAttribute('aria-hidden', String(!isOpen));
        };

        list.querySelectorAll('.mobile-menu-filter-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                syncState(false);
            });
        });

        const syncSide = function () {
            const beforeRect = toggle.getBoundingClientRect();
            const shouldOpenRight = beforeRect.left + (beforeRect.width / 2) < window.innerWidth / 2;
            const wasOpenRight = panel.classList.contains('is-left');

            if (shouldOpenRight === wasOpenRight) {
                return;
            }

            panel.classList.toggle('is-left', shouldOpenRight);

            const afterRect = toggle.getBoundingClientRect();
            const panelRect = panel.getBoundingClientRect();
            const handleSize = toggle.offsetWidth || 72;
            const nextLeft = Math.min(
                Math.max(panelRect.left + beforeRect.left - afterRect.left, 8 - panelRect.width + handleSize),
                window.innerWidth - handleSize - 8
            );

            panel.style.left = `${nextLeft}px`;
            panel.style.right = 'auto';
        };

        const movePanel = function (clientX, clientY) {
            const rect = panel.getBoundingClientRect();
            const handleSize = toggle.offsetWidth || 72;
            const handleLeft = panel.classList.contains('is-left') ? 0 : rect.width - handleSize;
            const minLeft = 8 - handleLeft;
            const maxLeft = window.innerWidth - handleSize - 8 - handleLeft;
            const nextLeft = Math.min(Math.max(clientX - offsetX, minLeft), maxLeft);
            const handleTop = (rect.height - handleSize) / 2;
            const minTop = 78 - handleTop;
            const maxTop = window.innerHeight - handleSize - 8 - handleTop;
            const nextTop = Math.min(Math.max(clientY - offsetY, minTop), maxTop);

            panel.style.left = `${nextLeft}px`;
            panel.style.top = `${nextTop}px`;
            panel.style.right = 'auto';
        };

        const stopDrag = function (event) {
            if (pointerId !== event.pointerId) {
                return;
            }

            toggle.releasePointerCapture(pointerId);
            pointerId = null;
            syncSide();

            if (!hasDragged) {
                syncState(!panel.classList.contains('is-open'));
                hasDragged = true;
            }
        };

        syncState(isMobile());
        syncSide();

        toggle.addEventListener('pointerdown', function (event) {
            const rect = panel.getBoundingClientRect();
            pointerId = event.pointerId;
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
            startX = event.clientX;
            startY = event.clientY;
            hasDragged = false;
            toggle.setPointerCapture(pointerId);
        });

        toggle.addEventListener('pointermove', function (event) {
            if (pointerId !== event.pointerId) {
                return;
            }

            const distanceX = Math.abs(event.clientX - startX);
            const distanceY = Math.abs(event.clientY - startY);

            if (distanceX > 5 || distanceY > 5) {
                hasDragged = true;
            }

            if (hasDragged) {
                movePanel(event.clientX, event.clientY);
            }
        });

        toggle.addEventListener('pointerup', stopDrag);
        toggle.addEventListener('pointercancel', stopDrag);

        toggle.addEventListener('click', function () {
            if (isMobile() || hasDragged) {
                return;
            }

            syncState(!panel.classList.contains('is-open'));
        });

        toggle.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                syncState(!panel.classList.contains('is-open'));
            }
        });

        window.addEventListener('resize', function () {
            if (!isMobile()) {
                syncState(false);
                panel.removeAttribute('style');
                panel.classList.remove('is-left');
                return;
            }

            syncSide();
        });
    };

    initializeMobileMenuFilter();

    const initializeMenuItemModal = function () {
        const modal = document.getElementById('menuItemModal');
        const image = document.getElementById('menuItemModalImage');
        const title = document.getElementById('menuItemModalTitle');
        const category = document.getElementById('menuItemModalCategory');
        const description = document.getElementById('menuItemModalDescription');
        const about = document.getElementById('menuItemModalAbout');
        const relatedList = document.getElementById('menuItemRelatedList');
        const orderButton = document.getElementById('menuItemOrderBtn');

        if (!modal || !image || !title || !category || !description || !about || !relatedList || !orderButton) {
            return;
        }

        const cards = Array.from(document.querySelectorAll('.menu-tab-content .menu-filter-item, .index-menu-items .menu-filter-item'));

        if (!cards.length) {
            return;
        }

        const getCardData = function (card) {
            const cardImage = card.querySelector('img');
            const titleText = card.querySelector('h5 span:first-child');
            const categoryText = card.querySelector('h5 span.text-primary');
            const descriptionText = card.querySelector('small');

            return {
                card,
                image: cardImage ? cardImage.getAttribute('src') : '',
                title: titleText ? titleText.textContent.trim() : '',
                category: categoryText ? categoryText.textContent.trim() : '',
                description: descriptionText ? descriptionText.textContent.trim() : '',
                categories: (card.dataset.menuCategory || '').split(/\s+/).filter(Boolean)
            };
        };

        const items = cards.map(getCardData).filter(function (item) {
            return item.title && item.image;
        });

        const getRelatedItems = function (item) {
            const related = items.filter(function (candidate) {
                return candidate.title !== item.title &&
                    candidate.categories.some(function (candidateCategory) {
                        return item.categories.includes(candidateCategory);
                    });
            });

            return related.slice(0, 4);
        };

        const escapeHtml = function (value) {
            return value.replace(/[&<>"']/g, function (character) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                }[character];
            });
        };

        const openModal = function (item) {
            image.src = item.image;
            image.alt = item.title;
            title.textContent = item.title;
            category.textContent = item.category;
            description.textContent = item.description;
            about.textContent = item.description + ' Made with Tummi Yummi care for fresh, satisfying moments.';
            orderButton.onclick = function () {
                window.location.href = 'booking.html';
            };

            relatedList.innerHTML = '';
            const relatedItems = getRelatedItems(item);

            relatedItems.forEach(function (relatedItem) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'menu-item-related-card';
                button.innerHTML = '<img src="' + escapeHtml(relatedItem.image) + '" alt="' + escapeHtml(relatedItem.title) + '">' +
                    '<strong>' + escapeHtml(relatedItem.title) + '</strong>' +
                    '<span>View <i class="fa fa-plus"></i></span>';
                button.addEventListener('click', function () {
                    openModal(relatedItem);
                });
                relatedList.appendChild(button);
            });

            if (relatedItems.length < 4) {
                const moreButton = document.createElement('button');
                moreButton.type = 'button';
                moreButton.className = 'menu-item-related-card menu-item-related-more';
                moreButton.innerHTML = '<i class="fa fa-utensils"></i>' +
                    '<strong>More Items</strong>' +
                    '<span>Open Menu <i class="fa fa-arrow-right"></i></span>';
                moreButton.addEventListener('click', function () {
                    window.location.href = 'menu.html';
                });
                relatedList.appendChild(moreButton);
            }

            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('menu-modal-open');
        };

        const closeModal = function () {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-modal-open');
        };

        items.forEach(function (item) {
            const trigger = item.card.querySelector('.d-flex.align-items-center') || item.card;
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('tabindex', '0');
            trigger.addEventListener('click', function () {
                openModal(item);
            });
            trigger.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openModal(item);
                }
            });
        });

        modal.querySelectorAll('[data-menu-modal-close]').forEach(function (closeTrigger) {
            closeTrigger.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    };

    initializeMenuItemModal();

    const initializeMobileQuickPanel = function () {
        const panel = document.getElementById('mobileQuickPanel');
        const toggle = document.getElementById('mobileQuickToggle');
        const links = document.getElementById('mobileQuickLinks');

        if (!panel || !toggle || !links) {
            return;
        }

        const syncState = function (isOpen) {
            panel.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            links.setAttribute('aria-hidden', String(!isOpen));
        };

        syncState(false);

        toggle.addEventListener('click', function () {
            syncState(!panel.classList.contains('is-open'));
        });

        document.addEventListener('click', function (event) {
            if (!panel.contains(event.target)) {
                syncState(false);
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 575.98) {
                syncState(false);
            }
        });
    };

    initializeMobileQuickPanel();

})(jQuery);

