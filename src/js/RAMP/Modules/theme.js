/*global define, TimelineLite, TweenLite, $ */

/**
* This submodule contains theme-specific classes with animation sequences such as Full Screen transition or tooltip
* setter helper method.
*
* @module RAMP
* @submodule Theme
*
*/

/**
*
*
* @class FEGC-Theme
* @uses Util
*/

define(['utils/util'],
    function (UtilMisc) {
        'use strict';

        var body = $('body');
        var wbCore = $('main');
        var wbFoot = $('footer');

        //megaMenuDiv = $('#wb-sm'),
        var navigation = $('#wb-bar');

        var header = $('body>header');

        var transitionDuration = 0.5;

        var layout = {
            headerHeight: 195,
            headerHeightCollapsed: 53,

            footerHeight: 30,
            footerHeightCollapsed: 5,

            subtitleHeight: 35,

            toolbarHeight: 32,
        };

        if ($('html').hasClass('no-wb-sm')) {
            // update header height if no-mega-menu class is present
            layout.headerHeight -= 58;
            header.find('#wb-sm').remove(); // remove megamenu
        }

        // height gain from the fullscreening the template
        var heightGain = layout.headerHeight - layout.headerHeightCollapsed +
                         layout.footerHeight - layout.footerHeightCollapsed;

        var isFullScreen = false;

        var fullScreenTimeLine = new TimelineLite({ paused: true });
        var subpanelTimeline = new TimelineLite();

        if (body.hasClass('sub-title')) {
            layout.headerHeight += layout.subtitleHeight;
            heightGain += layout.subtitleHeight;
        }

        // tweening wet template parts
        fullScreenTimeLine
                .to(header, transitionDuration, {
                    top: navigation.outerHeight() * -1,
                    position: 'relative',
                    ease: 'easeOutCirc',
                }, 0)

                //.set(megaMenuDiv, { display: 'none !important', className: '+=wb-invisible' })

                .to(wbCore, transitionDuration,
                    {
                        top: layout.headerHeightCollapsed,
                        bottom: layout.footerHeightCollapsed,
                        ease: 'easeOutCirc',
                    }, 0)
                .to(wbFoot, transitionDuration, { height: layout.footerHeightCollapsed, ease: 'easeOutCirc' }, 0)

            // set full-screen class here, not in the callback since callbacks can be overwritten by
            // fullScreenCallback function
            .call(function () { body.addClass('full-screen'); })

            .add(subpanelTimeline, 0); // special timeline to tween subpanels

        /**
         * Toggles full screen mode
         *
         * @method _toggleFullScreenMode
         * @param  {Boolean} fullscreen true - full screen on; false - full screen off; undefined - toggle;
         */
        function _toggleFullScreenMode(fullscreen) {
            subpanelTimeline
                .clear() // need to recreate this timeline every time to capture newly created subpanels
                .fromTo('.sub-panel-container.summary-data-details', transitionDuration,
                    {
                        top: layout.headerHeight + layout.toolbarHeight,
                        bottom: layout.footerHeight,
                    },
                    {
                        top: layout.headerHeightCollapsed + layout.toolbarHeight,
                        bottom: layout.footerHeightCollapsed,
                        ease: 'easeOutCirc',
                    }, 0)
                .fromTo('.sub-panel-container.full-data-details', transitionDuration,
                    {
                        top: layout.headerHeight,
                        bottom: layout.footerHeight,
                    },
                    {
                        top: layout.headerHeightCollapsed,
                        bottom: layout.footerHeightCollapsed,
                        ease: 'easeOutCirc',
                    }, 0);

            isFullScreen = UtilMisc.isUndefined(fullscreen) ? !isFullScreen : fullscreen;

            if (isFullScreen) {
                // need to tween datatables separately since it's very cumbersome to calculate their exact height -
                // easier just to adjust height up/down by height gained when fullscreening the template
                TweenLite
                    .to('.full-data-mode .dataTables_scrollBody', transitionDuration,

                        // animate height of the datatable scrollBody since it's explicitly set ,
                        { height: '+=' + heightGain, ease: 'easeOutCirc', delay: 0.02 });

                fullScreenTimeLine.play();

            } else {
                TweenLite
                    .to('.full-data-mode .dataTables_scrollBody', transitionDuration - 0.02,

                        // animate height of the datatable scrollBody since it's explicitly set ,
                        { height: '-=' + heightGain, ease: 'easeInCirc' });

                body.removeClass('full-screen');
                fullScreenTimeLine.reverse();
            }
        }

        return {
            /**
             * Allows to set callbacks to the full screen transition.
             *
             * @method fullScreenCallback
             * @param  {String} event Event name to set a callback on
             * @param  {Function} func  A callback function
             * @return {Object}     This
             * @chainable
             */
            fullScreenCallback: function (event, func) {
                fullScreenTimeLine.eventCallback(event, func);

                return this;
            },

            /**
             * Returns a boolean indication whether the full screen mode is on.
             *
             * @method isFullScreen
             * @return {Boolean} true / false
             */
            isFullScreen: function () {
                return isFullScreen;
            },

            /**
            * Toggles the FullScreen mode of the application
            *
            * @method toggleFullScreenMode
            * @param  {Boolean} fullscreen true - expand; false - collapse; undefined - toggle;
            * @return {Object} This
            * @chainable
            */
            toggleFullScreenMode: function (fullscreen) {
                _toggleFullScreenMode(fullscreen);

                return this;
            },
        };
    }

);
