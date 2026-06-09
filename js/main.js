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

    const initializeAutoScroller = function (scrollerSelector, trackSelector, label, options = {}) {
        const scrollers = document.querySelectorAll(scrollerSelector);

        if (!scrollers.length) {
            return;
        }

        const settings = {
            cloneTrack: false,
            speed: 0.55,
            resumeDelay: 1200,
            ...options
        };

        scrollers.forEach(function (scroller) {
            const track = scroller.querySelector(trackSelector);

            if (!track || track.children.length === 0) {
                return;
            }

            if (settings.cloneTrack && !track.dataset.autoScrollCloned) {
                track.innerHTML += track.innerHTML;
                track.dataset.autoScrollCloned = 'true';
            }

            const hiddenSlides = track.querySelectorAll('[aria-hidden="true"]');
            hiddenSlides.forEach(function (slide) {
                slide.dataset.autoScrollDuplicate = 'true';
            });

            let isPointerDown = false;
            let isPaused = false;
            let dragStartX = 0;
            let dragStartScrollLeft = 0;
            let resumeTimer = null;
            let resetPoint = track.scrollWidth / 2;

            scroller.classList.add('is-auto-scrolling');
            scroller.setAttribute('tabindex', '0');
            scroller.setAttribute('aria-label', label);

            const controls = document.createElement('div');
            controls.className = 'manual-scroll-controls';
            controls.setAttribute('aria-label', label + ' controls');

            const createButton = function (direction, icon, text) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'manual-scroll-btn';
                button.dataset.scrollDirection = direction;
                button.setAttribute('aria-label', text);
                button.innerHTML = '<i class="' + icon + '" aria-hidden="true"></i>';
                controls.appendChild(button);
                return button;
            };

            const prevButton = createButton('previous', 'fa fa-chevron-left', 'Previous ' + label);
            const nextButton = createButton('next', 'fa fa-chevron-right', 'Next ' + label);
            scroller.insertAdjacentElement('afterend', controls);

            const pauseAutoScroll = function () {
                window.clearTimeout(resumeTimer);
                isPaused = true;
            };

            const resumeAutoScroll = function () {
                window.clearTimeout(resumeTimer);
                resumeTimer = window.setTimeout(function () {
                    isPaused = false;
                }, settings.resumeDelay);
            };

            const getScrollStep = function () {
                const firstItem = track.children[0];
                const trackStyle = window.getComputedStyle(track);
                const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
                return firstItem ? firstItem.getBoundingClientRect().width + gap : scroller.clientWidth * 0.9;
            };

            const syncResetPoint = function () {
                resetPoint = track.scrollWidth / 2;
            };

            const updateControls = function () {
                const maxScroll = resetPoint - scroller.clientWidth;
                const hasOverflow = maxScroll > 2;
                controls.classList.toggle('is-hidden', !hasOverflow);
                prevButton.disabled = !hasOverflow || scroller.scrollLeft <= 1;
                nextButton.disabled = !hasOverflow || scroller.scrollLeft >= maxScroll - 1;
            };

            const moveScroller = function (direction) {
                const multiplier = direction === 'next' ? 1 : -1;
                pauseAutoScroll();
                scroller.scrollBy({
                    left: getScrollStep() * multiplier,
                    behavior: 'smooth'
                });
                resumeAutoScroll();
            };

            const autoScroll = function () {
                if (!isPaused && resetPoint > scroller.clientWidth) {
                    scroller.scrollLeft += settings.speed;

                    if (scroller.scrollLeft >= resetPoint) {
                        scroller.scrollLeft = 0;
                    }
                }

                window.requestAnimationFrame(autoScroll);
            };

            prevButton.addEventListener('click', function () {
                moveScroller('previous');
            });

            nextButton.addEventListener('click', function () {
                moveScroller('next');
            });

            scroller.addEventListener('pointerdown', function (event) {
                isPointerDown = true;
                pauseAutoScroll();
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
                scroller.classList.remove('is-dragging');
                updateControls();
                resumeAutoScroll();
            };

            scroller.addEventListener('mouseenter', pauseAutoScroll);
            scroller.addEventListener('mouseleave', resumeAutoScroll);
            scroller.addEventListener('touchstart', pauseAutoScroll, { passive: true });
            scroller.addEventListener('touchend', resumeAutoScroll, { passive: true });
            scroller.addEventListener('pointerup', stopDragging);
            scroller.addEventListener('pointercancel', stopDragging);
            scroller.addEventListener('pointerleave', stopDragging);
            scroller.addEventListener('scroll', updateControls);

            scroller.addEventListener('keydown', function (event) {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                    return;
                }

                event.preventDefault();
                moveScroller(event.key === 'ArrowRight' ? 'next' : 'previous');
            });

            window.addEventListener('resize', function () {
                syncResetPoint();
                updateControls();
            });

            window.setTimeout(function () {
                syncResetPoint();
                updateControls();
            }, 100);
            window.requestAnimationFrame(autoScroll);
        });
    };

    initializeAutoScroller('.blog-scroll', '.blog-scroll-track', 'Blog articles', {
        cloneTrack: true,
        speed: 0.6
    });

    initializeAutoScroller('.testimonial-slider', '.testimonial-track', 'Testimonials', {
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

    const initializeBookingWhatsappForms = function () {
        const forms = document.querySelectorAll('.booking-whatsapp-form');
        const whatsappNumber = '919496397390';

        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const formData = new FormData(form);
                const message = [
                    'Hello Tummi Yummi team, I would like to place an advance order. Please review my booking details and confirm availability soon.',
                    '',
                    'Name: ' + (formData.get('name') || ''),
                    'Contact: ' + (formData.get('contact') || ''),
                    'Place: ' + (formData.get('place') || ''),
                    'Preferred Date & Time: ' + (formData.get('datetime') || ''),
                    'Item Name: ' + (formData.get('itemName') || ''),
                    'Item Count: ' + (formData.get('itemCount') || ''),
                    'Booking Details: ' + (formData.get('message') || '')
                ].join('\n');

                window.location.href = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
            });
        });
    };

    initializeBookingWhatsappForms();

    const initializeFooterFeedbackForms = function () {
        const forms = document.querySelectorAll('.footer-feedback-form');

        if (!forms.length) {
            return;
        }

        forms.forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();

                const input = form.querySelector('[name="feedback"]');
                const feedback = input ? input.value.trim() : '';

                if (!feedback) {
                    if (input) {
                        input.setCustomValidity('Please enter your feedback.');
                        input.focus();
                        input.reportValidity();
                        input.addEventListener('input', function clearFeedbackValidity() {
                            input.setCustomValidity('');
                            input.removeEventListener('input', clearFeedbackValidity);
                        });
                    }
                    return;
                }

                input.setCustomValidity('');
                const whatsappNumber = form.getAttribute('data-whatsapp-number') || '919496397390';
                const message = 'Feedback: ' + feedback;

                window.location.href = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
            });
        });
    };

    initializeFooterFeedbackForms();

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

