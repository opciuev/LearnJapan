var isCordovaApp = document.URL.indexOf('http://') === -1
  && document.URL.indexOf('https://') === -1;

console.log("cdv", isCordovaApp);

$(document).ready(function() {
  // Closing menu with ESC
  document.addEventListener('keyup', function(e){
      if(e.keyCode == 27 && $('.search-overlay').length) {
          close_search();
      }
  });

  var trigger = $('.hamburger').add('.overlay'),
      overlay = $('.overlay'),
     isClosed = false;

    trigger.click(function () {
      hamburger_cross();      
    });

    function hamburger_cross() {

      if (isClosed == true) {          
        overlay.hide();
        trigger.removeClass('is-open');
        trigger.addClass('is-closed');
        isClosed = false;
      } else {   
        overlay.show();
        trigger.removeClass('is-closed');
        trigger.addClass('is-open');
        isClosed = true;
      }
  }
  
  trigger.click(function () {
        $('#wrapper').toggleClass('toggled');
  });  

  $("table").addClass("table");
  $('.theme-link').click(function(e){
    e.preventDefault();
    settheme($(this).attr('data-theme'));
  });

  if (supports_storage) {
    var theme = localStorage.theme;
    if (theme) settheme(theme);
  } else {
    /* Don't annoy user with options that don't persist */
    $('#theme-dropdown').hide();
  }
});

function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

var supports_storage = supports_html5_storage();

function settheme(theme, persist) {
  if (typeof persist === 'undefined') { persist = true; }
  var themeurl = basethemeurl + theme + ".min.css"; 
  $('link[title="theme"]').attr('href', themeurl);
  if (supports_storage && persist) localStorage.theme = theme;
}

// 返回顶部按钮功能
$(document).ready(function() {
  // 创建返回顶部按钮
  var scrollToTopBtn = $('<div class="scroll-to-top" id="scrollToTop"><div class="arrow-up"></div></div>');
  $('body').append(scrollToTopBtn);
  
  // 滚动检测
  $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
      scrollToTopBtn.addClass('show');
    } else {
      scrollToTopBtn.removeClass('show');
    }
  });
  
  // 点击返回顶部
  scrollToTopBtn.click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 600, 'swing');
  });
  
  // 添加触摸支持（移动端）
  scrollToTopBtn.on('touchstart', function() {
    $(this).addClass('touch-active');
  }).on('touchend', function() {
    $(this).removeClass('touch-active');
  });
});
