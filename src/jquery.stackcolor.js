/**
 * jQuery.stackcolor
 *
 * (a) Wil Neeley
 * (c) Code may be freely distributed under the MIT license.
 */
;(function ( $, window, document, undefined ) {

  "use strict";

  var
    plugin_name   = 'stackcolor',
    defaults      = {
      onResult: function() {}
    };

  // Plugin constructor
  function Plugin( element, options ) {
    this._name = plugin_name;
    this._defaults = defaults;
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this.init();
  }

  // Extend plugin prototype
  $.extend(Plugin.prototype, {

    /**
     * Initialization method - plugin bootstrap
     */
    init: function() {
      var
        self            = this,
        elm             = $(this.element),
        elm_bound       = this.element.getBoundingClientRect(),
        stack_elms      = $('[data-stackcolor]'),
        all_colors      = [],
        avg_color;

      // Iterate over possible elements
      stack_elms.each(function(idx, val) {
        var
          stack_elm                 = $(val),
          stack_elm_bound           = stack_elm[0].getBoundingClientRect(),
          overlap                   = self.doElementsOverlap(elm_bound, stack_elm_bound),
          deep                      = stack_elm.attr('data-stackcolor');
        if (overlap) {
          var
            colors        = self.getElementColors(stack_elm, deep);
          all_colors = all_colors.concat(colors);
        }
      });

      // Calculate average color
      avg_color = this.calcColorAverages(all_colors);

      // Execute onResult callback
      this.options.onResult.call(this, {
        rgb: avg_color.rgb,
        hex: avg_color.hex,
        elm: elm
      });
    },

    /**
     * Determine if elements overlap
     */
    doElementsOverlap: function(b1, b2) {
      var
        b1_top          = b1.y,
        b1_bottom       = b1.y + b1.height,
        b1_left         = b1.x,
        b1_right        = b1.x + b1.width,
        b2_top          = b2.y,
        b2_bottom       = b2.y + b2.height,
        b2_left         = b2.x,
        b2_right        = b2.x + b2.width;
      return !(b1_right < b2_left ||
               b1_left > b2_right ||
               b1_bottom < b2_top ||
               b1_top > b2_bottom);
    },

    /**
     * Get background colors of element and children block elements.
     */
    getElementColors: function(elm, deep) {
      var
        self           = this,
        colors         = [this.rgb2hex(elm.css('backgroundColor'))];
      if (deep) {
        $('*', elm).each(function(idx, val) {
          if (self.doElementsOverlap(self.element.getBoundingClientRect(), val.getBoundingClientRect())) {
            colors.push(self.rgb2hex($(val).css('backgroundColor')));
          }
        });
      }
      return colors;
    },

    /**
     * Convert rgb to hex
     */
    rgb2hex: function(rgb) {
      var
        hex_digits     = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"),
        hex            = function(x) {
          return isNaN(x) ? "00" : hex_digits[(x - x % 16) / 16] + hex_digits[x % 16];
        };
      rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    },

    /**
     * Calculate average rgb and hex color from array of hex color values.
     */
    calcColorAverages: function(colors) {
      var
        rgb_colors    = [],
        r             = 0,
        g             = 0,
        b             = 0,
        hex2rgb       = function(hex) {
          if (hex.lastIndexOf('#') > -1) {
            hex = hex.replace(/#/, '0x');
          } else {
            hex = '0x' + hex;
          }
          var r = hex >> 16;
          var g = (hex & 0x00FF00) >> 8;
          var b = hex & 0x0000FF;
          return [r, g, b];
        };

      // Convert colors to rgb
      for (var i = 0; i < colors.length; i++) {
        rgb_colors.push(hex2rgb(colors[i]));
      }

      // Enumerate color groups
      for (var n = 0; n < rgb_colors.length; n++) {
        var group = rgb_colors[n];
        r += group[0];
        g += group[1];
        b += group[2];
      }

      // Average decimal colors
      var rgb_avg = {
        r: Math.floor(r / rgb_colors.length),
        g: Math.floor(g / rgb_colors.length),
        b: Math.floor(b / rgb_colors.length)};
      var hex_avg = this.rgb2hex('rgb(' + rgb_avg.r + ', ' + rgb_avg.g +', ' + rgb_avg.b +')');

      // Return color average object
      return {
        rgb: rgb_avg,
        hex: hex_avg
      };
    }
  });

  // Plugin wrapper
  $.fn[plugin_name] = function ( options ) {
    return this.each(function () {
      $.data(this, 'plugin_' + plugin_name, new Plugin( this, options ));
    });
  };

})( jQuery, window, document );
