(function ($) {
    "use strict"; // Start of use strict
    /* ---------------------------------------------
     Resize mega menu
     --------------------------------------------- */

    function responsive_megamenu_item(container, element) {
        if ( container != 'undefined' ) {
            var container_width  = 0,
                container_offset = container.offset();

            if ( typeof container_offset != 'undefined' ) {
                container_width = container.innerWidth();
                setTimeout(function () {
                    $(element).children('.megamenu').css({'max-width': container_width + 'px'});
                    var sub_menu_width = $(element).children('.megamenu').outerWidth(),
                        item_width     = $(element).outerWidth();
                    $(element).children('.megamenu').css({'left': '-' + (sub_menu_width / 2 - item_width / 2) + 'px'});
                    var container_left  = container_offset.left,
                        container_right = (container_left + container_width),
                        item_left       = $(element).offset().left,
                        overflow_left   = (sub_menu_width / 2 > (item_left - container_left)),
                        overflow_right  = ((sub_menu_width / 2 + item_left) > container_right);

                    if ( overflow_left ) {
                        var left = (item_left - container_left);
                        $(element).children('.megamenu').css({'left': -left + 'px'});
                    }
                    if ( overflow_right && !overflow_left ) {
                        var left = (item_left - container_left);
                        left     = left - (container_width - sub_menu_width);
                        $(element).children('.megamenu').css({'left': -left + 'px'});
                    }
                }, 100);
            }
        }
    }

    function Stelina_resize_megamenu() {
        var window_size = jQuery('body').innerWidth();
        window_size += Stelina_get_scrollbar_width();
        if ( $('.Stelina-menu-wapper.horizontal .item-megamenu').length > 0 && window_size > 991 ) {
            $('.Stelina-menu-wapper.horizontal .item-megamenu').each(function () {
                var _this            = $(this),
                    _data_responsive = _this.children('.megamenu').data('responsive'),
                    _container       = _this.closest('.Stelina-menu-wapper');
                if ( _data_responsive != '' )
                    _container = _this.closest(_data_responsive);

                responsive_megamenu_item(_container, _this);
            });
        }
    }

    /**==============================
     Auto width Vertical menu
     ===============================**/
    function Stelina_auto_width_vertical_menu() {
        $('.Stelina-menu-wapper.vertical.support-mega-menu').each(function () {
            var menu_offset = $(this).offset(),
                menu_width  = parseInt($(this).actual('width')),
                menu_left   = menu_offset.left + menu_width;

            $(this).find('.megamenu').each(function () {
                var data_responsive   = $(this).data('responsive'),
                    element_caculator = $('.container');
                if ( data_responsive != '' )
                    element_caculator = $(this).closest(data_responsive);

                var container_width  = parseInt(element_caculator.innerWidth()) - 30,
                    container_offset = element_caculator.offset(),
                    container_left   = container_offset.left + container_width,
                    width            = (container_width - menu_width);

                if ( menu_offset.left > container_left || menu_left < container_offset.left )
                    width = container_width;
                if ( menu_left > container_left )
                    width = container_width - (menu_width - (menu_left - container_left)) - 30;

                if ( width > 0 )
                    $(this).css('max-width', width + 'px');
            });
        })
    }

    function Stelina_get_scrollbar_width() {
        var $inner = jQuery('<div style="width: 100%; height:200px;">test</div>'),
            $outer = jQuery('<div style="width:200px;height:150px; position: absolute; top: 0; left: 0; visibility: hidden; overflow:hidden;"></div>').append($inner),
            inner  = $inner[ 0 ],
            outer  = $outer[ 0 ];
        jQuery('body').append(outer);
        var width1 = inner.offsetWidth;
        $outer.css('overflow', 'scroll');
        var width2 = outer.clientWidth;
        $outer.remove();
        return (width1 - width2);
    }

    /* ---------------------------------------------
     MOBILE MENU
     --------------------------------------------- */
    function Stelina_menuclone_all_menus() {
        if ( !$('.Stelina-menu-clone-wrap').length && $('.Stelina-clone-mobile-menu').length > 0 ) {
            $('body').prepend('<div class="Stelina-menu-clone-wrap">' +
                '<div class="Stelina-menu-panels-actions-wrap">' +
                '<span class="Stelina-menu-current-panel-title">MENU</span>' +
                '<a class="Stelina-menu-close-btn Stelina-menu-close-panels" href="#">x</a></div>' +
                '<div class="Stelina-menu-panels"></div>' +
                '</div>');
        }
        var i                = 0,
            panels_html_args = Array();
        if ( !$('.Stelina-menu-clone-wrap .Stelina-menu-panels #Stelina-menu-panel-main').length ) {
            $('.Stelina-menu-clone-wrap .Stelina-menu-panels').append('<div id="Stelina-menu-panel-main" class="Stelina-menu-panel Stelina-menu-panel-main"><ul class="depth-01"></ul></div>');
        }

        $('.Stelina-clone-mobile-menu').each(function () {
            var $this              = $(this),
                thisOfficeu           = $this,
                this_menu_id       = thisOfficeu.attr('id'),
                this_menu_clone_id = 'Stelina-menu-clone-' + this_menu_id;

            if ( !$('#' + this_menu_clone_id).length ) {
                var thisClone = $this.clone(true); // Clone Wrap
                thisClone.find('.menu-item').addClass('clone-menu-item');

                thisClone.find('[id]').each(function () {
                    // Change all tab links with href = this id
                    thisClone.find('.vc_tta-panel-heading a[href="#' + $(this).attr('id') + '"]').attr('href', '#' + Stelina_menuadd_string_prefix($(this).attr('id'), 'Stelina-menu-clone-'));
                    thisClone.find('.Stelina-menu-tabs .tabs-link a[href="#' + $(this).attr('id') + '"]').attr('href', '#' + Stelina_menuadd_string_prefix($(this).attr('id'), 'Stelina-menu-clone-'));
                    $(this).attr('id', Stelina_menuadd_string_prefix($(this).attr('id'), 'Stelina-menu-clone-'));
                });

                thisClone.find('.Stelina-menu-menu').addClass('Stelina-menu-menu-clone');

                // Create main panel if not exists

                var thisMainPanel = $('.Stelina-menu-clone-wrap .Stelina-menu-panels #Stelina-menu-panel-main ul');
                thisMainPanel.append(thisClone.html());

                Stelina_menu_insert_children_panels_html_by_elem(thisMainPanel, i);
            }
        });
    }

    // i: For next nav target
    function Stelina_menu_insert_children_panels_html_by_elem($elem, i) {
        if ( $elem.find('.menu-item-has-children').length ) {
            $elem.find('.menu-item-has-children').each(function () {
                var thisChildItem = $(this);
                Stelina_menu_insert_children_panels_html_by_elem(thisChildItem, i);
                var next_nav_target = 'Stelina-menu-panel-' + i;

                // Make sure there is no duplicate panel id
                while ( $('#' + next_nav_target).length ) {
                    i++;
                    next_nav_target = 'Stelina-menu-panel-' + i;
                }
                // Insert Next Nav
                thisChildItem.prepend('<a class="Stelina-menu-next-panel" href="#' + next_nav_target + '" data-target="#' + next_nav_target + '"></a>');

                // Get sub menu html
                var sub_menu_html = $('<div>').append(thisChildItem.find('> .submenu').clone()).html();
                thisChildItem.find('> .submenu').remove();

                $('.Stelina-menu-clone-wrap .Stelina-menu-panels').append('<div id="' + next_nav_target + '" class="Stelina-menu-panel Stelina-menu-sub-panel Stelina-menu-hidden">' + sub_menu_html + '</div>');
            });
        }
    }

    function Stelina_menuadd_string_prefix(str, prefix) {
        return prefix + str;
    }

    function Stelina_menuget_url_var(key, url) {
        var result = new RegExp(key + "=([^&]*)", "i").exec(url);
        return result && result[ 1 ] || "";
    }

    function Stelina_close_mobile_menu() {
        // BOX MOBILE MENU
        $(document).on('click', '.menu-toggle', function () {
            $('.Stelina-menu-clone-wrap').addClass('open');
            return false;
        });
        // Close box menu
        $(document).on('click', '.Stelina-menu-clone-wrap .Stelina-menu-close-panels', function () {
            $('.Stelina-menu-clone-wrap').removeClass('open');
            return false;
        });
        $(document).on('click', function (event) {
            if ( $('body').hasClass('rtl') ) {
                if ( event.offsetX < 0 )
                    $('.Stelina-menu-clone-wrap').removeClass('open');
            } else {
                if ( event.offsetX > $('.Stelina-menu-clone-wrap').width() )
                    $('.Stelina-menu-clone-wrap').removeClass('open');
            }
        });
    }

    // Open next panel
    $(document).on('click', '.Stelina-menu-next-panel', function (e) {
        var $this     = $(this),
            thisItem  = $this.closest('.menu-item'),
            thisPanel = $this.closest('.Stelina-menu-panel'),
            target_id = $this.attr('href');

        if ( $(target_id).length ) {
            thisPanel.addClass('Stelina-menu-sub-opened');
            $(target_id).addClass('Stelina-menu-panel-opened').removeClass('Stelina-menu-hidden').attr('data-parent-panel', thisPanel.attr('id'));
            // Insert current panel title
            var item_title     = thisItem.find('.Stelina-menu-item-title').attr('title'),
                firstItemTitle = '';

            if ( $('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').length > 0 ) {
                firstItemTitle = $('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').html();
            }

            if ( typeof item_title != 'undefined' && typeof item_title != false ) {
                if ( !$('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').length ) {
                    $('.Stelina-menu-panels-actions-wrap').prepend('<span class="Stelina-menu-current-panel-title"></span>');
                }
                $('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').html(item_title);
            }
            else {
                $('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').remove();
            }

            // Back to previous panel
            $('.Stelina-menu-panels-actions-wrap .Stelina-menu-prev-panel').remove();
            $('.Stelina-menu-panels-actions-wrap').prepend('<a data-prenttitle="' + firstItemTitle + '" class="Stelina-menu-prev-panel" href="#' + thisPanel.attr('id') + '" data-cur-panel="' + target_id + '" data-target="#' + thisPanel.attr('id') + '"></a>');
        }

        e.preventDefault();
    });

    // Go to previous panel
    $(document).on('click', '.Stelina-menu-prev-panel', function (e) {
        var $this        = $(this),
            cur_panel_id = $this.attr('data-cur-panel'),
            target_id    = $this.attr('href');

        $(cur_panel_id).removeClass('Stelina-menu-panel-opened').addClass('Stelina-menu-hidden');
        $(target_id).addClass('Stelina-menu-panel-opened').removeClass('Stelina-menu-sub-opened');

        // Set new back button
        var new_parent_panel_id = $(target_id).attr('data-parent-panel');
        if ( typeof new_parent_panel_id == 'undefined' || typeof new_parent_panel_id == false ) {
            $('.Stelina-menu-panels-actions-wrap .Stelina-menu-prev-panel').remove();
            $('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').html('MAIN MENU');
        }
        else {
            $('.Stelina-menu-panels-actions-wrap .Stelina-menu-prev-panel').attr('href', '#' + new_parent_panel_id).attr('data-cur-panel', target_id).attr('data-target', '#' + new_parent_panel_id);
            // Insert new panel title
            var item_title = $('#' + new_parent_panel_id).find('.Stelina-menu-next-panel[data-target="' + target_id + '"]').closest('.menu-item').find('.Stelina-menu-item-title').attr('data-title');
            item_title     = $(this).data('prenttitle');
            if ( typeof item_title != 'undefined' && typeof item_title != false ) {
                if ( !$('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').length ) {
                    $('.Stelina-menu-panels-actions-wrap').prepend('<span class="Stelina-menu-current-panel-title"></span>');
                }
                $('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').html(item_title);
            }
            else {
                $('.Stelina-menu-panels-actions-wrap .Stelina-menu-current-panel-title').remove();
            }
        }

        e.preventDefault();
    });

    /* ---------------------------------------------
     Scripts resize
     --------------------------------------------- */

    $(window).on("resize", function () {
        Stelina_resize_megamenu();
        Stelina_close_mobile_menu();
        Stelina_auto_width_vertical_menu();
    });
    window.addEventListener('load',
        function (ev) {
            Stelina_resize_megamenu();
            Stelina_close_mobile_menu();
            Stelina_auto_width_vertical_menu();
            Stelina_menuclone_all_menus();
        }, false);

})(jQuery); // End of use strict