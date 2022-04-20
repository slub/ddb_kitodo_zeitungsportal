/**
 * (c) Kitodo. Key to digital objects e.V. <contact@kitodo.org>
 *
 * This file is part of the Kitodo and TYPO3 projects.
 *
 * @license GNU General Public License version 3 or later.
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */

// The frontend may load the JS multiple times (TODO...), so avoid redeclaration
if (typeof ddbKitodoZeitungsportalFullTextControl === 'undefined') {
    class ddbKitodoZeitungsportalFullTextControl extends dlfViewerFullTextControl {
        constructor(map, image, fulltextUrl) {
            super(map, image, fulltextUrl);

            /**
             * @type {Array}
             * @private
             */
            this.positions_;

            /**
             * @type {any}
             * @private
             */
            this.element;

            /**
             * @type {string}
             * @private
             */
            this.lastHeight;
        }

        /**
         * Allow accessing positions in a method that is called in base constructor.
         * @private
         */
        get positions() {
            if (this.positions_ === undefined) {
                this.positions_ = {};
            }

            return this.positions_;
        }

        /**
         * Recalculate position of text lines if full text container was resized
         */
        onResize() {
            if (this.element != undefined && this.element.css('width') != this.lastHeight) {
                this.lastHeight = this.element.css('width');
                this.calculatePositions();
            }
        }

        /**
         * Calculate position of text lines for scrolling
         */
        calculatePositions() {
            this.positions.length = 0;

            let texts = $('#tx-dlf-fulltextselection').children('span.textline');
            let offset = $('#' + texts[0].id).position().top;

            for (let text of texts) {
                let pos = $('#' + text.id).position().top;
                this.positions[text.id] = pos - offset;
            }
        }

        /**
         * @override
         */
        addHighlightEffect(textlineFeature, hoverSourceTextline_) {
            if (textlineFeature) {
                var targetElem = $('#' + textlineFeature.getId());

                if (targetElem.length > 0 && !targetElem.hasClass('highlight')) {
                    targetElem.addClass('highlight');
                    this.onResize();
                    setTimeout(this.scrollToText, 1000, targetElem, this.fullTextScrollElement, this.positions);
                    hoverSourceTextline_.addFeature(textlineFeature);
                }
            }
        }

        /**
         * @override
         */
        scrollToText(element, fullTextScrollElement, positions) {
            if (element.hasClass('highlight')) {
                $(fullTextScrollElement).animate({
                    scrollTop: positions[element[0].id]
                }, 500);
            }
        }

        /**
         * @override
         */
        activate() {
            super.activate();

            if (this.element === undefined) {
                this.element = $("#tx-dlf-fulltextselection");
            }
        }

        /**
         * @override
         */
        showFulltext(features) {
            super.showFulltext(features);

            if (features !== undefined) {
                this.calculatePositions();
            }
        }
    }

    dlfViewerFullTextControl = ddbKitodoZeitungsportalFullTextControl;
}
