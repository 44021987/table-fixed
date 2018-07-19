/*
 * @Author: xudan
 * @Date:   2018-07-17
 */
;
(function ($) {
  function throttle (fn, ms) {
    var isFirst = true,
        timer = null;
    return function () {
      var _this = this;
      if (isFirst) {
        fn.apply(this, arguments)
        isFirst = !isFirst;
        return
      }
      if (timer) return
      timer = setTimeout(function () {
        clearTimeout(timer)
        fn.apply(_this, arguments)
        timer = null
      }, ms || 30)
    }
  }
  $.fn.extend({
    fixedTable: function () {
      var $this = $(this)
      $.fixedTableInit($(this))
      $(this).find('.table-fixed-box').on('scroll', $.fixedTableScrollHandle).trigger('scroll')
      $(window).on('resize', throttle(function () {
        $.resetFixedTable($this)
      }))
    }
  })
  $.extend({
    fixedTableInit: function ($el) {
      $el.each(function () {
        $.createdFixedWrap($(this))
      })
    },
    resetFixedTable: function ($el) {
      $el.find('.fixed-body-wrap').remove()
      $.fixedTableInit($el)
    },
    createdFixedWrap: function ($el) {
      var $fixedWrap = $('<div class="fixed-body-wrap"></div>')
      var $head = $.createdFixedHead($el)
      var $scrollHead = $.createFixedScorllHead($el)
      var $column = $.createdFixedColumn($el)
      $fixedWrap.append($head)
      $fixedWrap.append($scrollHead)
      $fixedWrap.append($column)
      $el.append($fixedWrap)
    },
    createFixedScorllHead: function ($el) {
      var $oldTable = $.getOldTable($el);
      var $clone = $oldTable.clone(true).css('width', $oldTable.outerWidth());
      var $fixed = $('<div class="fixed-table-head-scroll"></div>');
      var oh = $oldTable.find('thead').outerHeight();
      var scrollBar = $.fixedWraphasScrollBar($oldTable.parent()).heightScroll;
      var fixedWidth = scrollBar ? $oldTable.parent().outerWidth() - $.getScrollWidth() : '100%'
      $fixed.append($clone).css({
        height: oh,
        width: fixedWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        overflow: 'hidden'
      })
      return $fixed
    },
    createdFixedHead: function ($el) {
      var column = $el.attr('column') || 1;
      var $oldTable = $.getOldTable($el);
      var $fixed = $('<div class="fixed-table-head"></div>');
      var oldHeadTh = $oldTable.find('thead th');
      var $clone = $oldTable.clone(true).css('width', $oldTable.outerWidth());
      var oW = 0;
      var oH = $oldTable.find('thead').outerHeight();
      $clone.find('tbody').remove();

      oldHeadTh.each(function (i) {
        var $th = $clone.find('thead th').eq(i)
        var thWidth = $(this).outerWidth()
        if (i >= parseInt(column)) {
          return false
        }
        oW += thWidth
      })
      $fixed.append($clone).css({
        width: oW,
        height: oH,
        zIndex: 2,
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'hidden'
      })
      return $fixed
    },
    createdFixedColumn: function ($el) {
      var column = $el.attr('column') || 1;
      var $oldTable = $.getOldTable($el);
      var $fixed = $('<div class="fixed-table-body"></div>');
      var $clone = $oldTable.clone(true).css({
        width: $oldTable.outerWidth(),
        height: $oldTable.outerHeight()
      });
      var scrollBar = $.fixedWraphasScrollBar($oldTable.parent()).widthScroll;
      var fixedHeight = scrollBar ? $oldTable.parent().outerHeight() - $.getScrollWidth() : '100%'
      var ow = 0;
      $oldTable.find('thead th').each(function (i) {
        if (i >= parseInt(column)) return false
        ow += $(this).outerWidth()
      })
      $fixed.append($clone).css({
        height: fixedHeight,
        width: ow,
        position: 'absolute',
        left: 0,
        top: '1px',
        zIndex: 1,
        overflow: 'hidden'
      })
      return $fixed
    },
    getOldTable: function ($el) {
      return $el.find('.table-fixed-box .fixed-table-main')
    },
    fixedTableScrollHandle: function (e) {
      var $fixedWrap = $(this).siblings('.fixed-body-wrap');
      var scrollTop = $(this).scrollTop();
      var scrollLeft = $(this).scrollLeft();
      $fixedWrap.find('.fixed-table-head-scroll table').css('margin-left', -scrollLeft)
      $fixedWrap.find('.fixed-table-body table').css('margin-top', -scrollTop)
    },
    fixedWraphasScrollBar: function ($el) {
      return {
        heightScroll: $el[0].scrollHeight > $el[0].clientHeight,
        widthScroll: $el[0].scrollWidth > $el[0].clientWidth
      }
    },
    getScrollWidth: function () {
      var div = document.createElement("div"),
        w1 = 0,
        w2 = 0;
      document.body.appendChild(div);
      div.style.position = "fixed";
      div.style.left = "-2000px";
      div.style.width = "200px";
      div.style.height = "200px";
      w1 = div.clientWidth;
      div.style.overflow = "scroll";
      w2 = div.clientWidth;
      document.body.removeChild(div);
      return w1 - w2;
    }
  })
})($)