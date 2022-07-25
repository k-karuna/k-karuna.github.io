function navShow() {
    $('.navbar').removeClass('navbar-dark');
    $('.navbar').addClass('navbar-light');
    navVisible = true;
}
function navHide() {
    $('.navbar').removeClass('navbar-light');
    $('.navbar').addClass('navbar-dark');
    navVisible = false;
}
function scrollTo(hash) {
    var newPos = $(hash).offset().top;
    if ($(window).scrollTop() !== newPos) {
        $('html, body').stop().animate({ scrollTop: newPos }, 600);
        $(window).focus();
    }
}

$(document).ready(function () {  
    wWidth = $(window).outerWidth();
    currScroll = $(window).scrollTop();
    navVisible = false;

    if (currScroll >= 5 || wWidth <= 767) {
        navShow();
    }

    $(window).resize(function () {
        wWidth = $(window).outerWidth();
        if (wWidth <= 767 && !navVisible) {
            navShow();
        }
        if (wWidth > 767) {
            if (currScroll < 5 && navVisible) {
                navHide();
            }
            else if (currScroll >= 5 && !navVisible) {
                navShow();
            }
        }
    });

    $(document).scroll(function () {
        currScroll = $(window).scrollTop();
        if (wWidth > 767) {
            if (currScroll < 5 && navVisible) {
                navHide();
                $(window).focus();
            }
            else if (currScroll >= 5 && !navVisible) {
                navShow();
                $(window).focus();
            }
        }
    });

    $("a[href^='#'][data-toggle!='collapse']").on('click', function (event) {
        if (this.hash !== '') {
            event.preventDefault();

            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-collapse').collapse('hide');
            }

            scrollTo(this.hash);
        }
    });
});
