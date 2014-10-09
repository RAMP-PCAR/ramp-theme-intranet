/*global define, TimelineLite, $ */

/**
* This submodule contains theme-specific classes with animation sequences such as Full Screen transition or tooltip setter helper method.
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

define(["utils/util"],
    function (util) {
        "use strict";
        
        var body = $("body"),
            wbCore = $("main"),
            wbFoot = $("footer"),

            megaMenuDiv = $("#wb-sm"),
            navigation = $("#wb-bar"),
            title = navigation.next(),

            header = $("header"),

            transitionDuration = 0.5,

            isFullScreen = false,
            fullScreenTimeLine = new TimelineLite(
                {
                    paused: true
                });

        fullScreenTimeLine
                .to(header, transitionDuration, { top: "-46px", position: "relative", ease: "easeOutCirc" }, 0)
                .set([navigation, megaMenuDiv], { display: "none !important" })

                .to(title, transitionDuration, { top: "-22px" }, 0)

                .fromTo(body, transitionDuration, { "background-position-y": "43px" }, { "background-position-y": "-26px", ease: "easeOutCirc" }, 0)
                .to(wbCore, transitionDuration, { top: "61px", bottom: "5px", ease: "easeOutCirc" }, 0)
                .to(wbFoot, transitionDuration, { height: "5px", ease: "easeOutCirc" }, 0)

                .set(body, { className: "+=full-screen" });

        /**
         * Toggles full screen mode
         *
         * @method _toggleFullScreenMode
         * @param  {Boolean} fullscreen true - full screen on; false - full screen off; undefined - toggle;
         */
        function _toggleFullScreenMode(fullscreen) {
            var extraTweeen = new TimelineLite({ paused: true });

            isFullScreen = util.isUndefined(fullscreen) ? !isFullScreen : fullscreen;

            if (isFullScreen) {
                fullScreenTimeLine.play();

                extraTweeen
                    .to(".sub-panel-container.summary-data-details", transitionDuration, { top: "93px", bottom: "10px", ease: "easeOutCirc" }, 0)
                    .to(".sub-panel-container.full-data-details", transitionDuration, { top: "61px", bottom: "10px", ease: "easeOutCirc" }, 0)

                    .to(".full-data-mode .dataTables_scrollBody", transitionDuration, { height: "+=160px", ease: "easeOutCirc" }, 0.01); // animate height of the datatable scrollBody since it's explicitly set
            } else {
                fullScreenTimeLine.reverse();

                extraTweeen
                    .to(".sub-panel-container.summary-data-details", transitionDuration, { top: "239px", bottom: "0px", ease: "easeInCirc" }, 0)
                    .to(".sub-panel-container.full-data-details", transitionDuration, { top: "207px", bottom: "0px", ease: "easeInCirc" }, 0)

                    .to(".full-data-mode .dataTables_scrollBody", transitionDuration - 0.01, { height: "-=160px", ease: "easeInCirc" }, 0); // animate height of the datatable scrollBody since it's explicitly set
            }

            extraTweeen.play();
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
            * @private
            * @param  {boolean} fullscreen true - expand; false - collapse; undefined - toggle;
            */
            toggleFullScreenMode: function (fullscreen) {
                _toggleFullScreenMode(fullscreen);
                return this;
            },

            /**
             * Tooltip setter helper method.
             *
             * @method tooltipster
             * @param  {Jquery} target  A node to looked for tooltiped children on
             * @param  {String} type    Type of the tooltips to set
             * @param  {String} [action] Action name: "update" will update all the tooltips on target with their respective title attributes;
             * null will create new tooltips
             * @return {Object}         This
             * @chainable
             */
            tooltipster: function (target, type, action) {
                var attr;
                target = target || $("body");

                switch (type) {
                    case "map":
                        break;

                    default:
                        attr = {
                            theme: 'tooltipster-shadow',
                            delay: 500
                        };
                        break;
                }

                switch (action) {
                    case "update":

                        target
                            .find(".tooltipstered")
                            .each(function (i, obj) {
                                var node = $(obj);
                                node
                                    .tooltipster("content", node.attr("title"))
                                    .removeAttr("title");
                            });
                        break;

                    default:
                        target.find('.tooltip, ._tooltip')
                            .tooltipster({
                                theme: 'tooltipster-shadow',
                                delay: 500
                            });
                        break;
                }

                return this;
            }
        };
    }
);