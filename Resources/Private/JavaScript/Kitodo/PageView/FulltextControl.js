/**
 * (c) Kitodo. Key to digital objects e.V. <contact@kitodo.org>
 *
 * This file is part of the Kitodo and TYPO3 projects.
 *
 * @license GNU General Public License version 3 or later.
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */

/**
 * TODO: This can probably be simplified or partly merged into Kitodo
 */
ddbKitodoZeitungsportalFullTextControl = class extends dlfViewerFullTextControl {
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
        this.lastWidth;
    }

    /**
     * This getter allows to access and initialize `this.positions_` in a method called from base class constructor
     * (via `activate()` -> `showFulltext()` -> `calculatePositions()`).
     *
     * @private
     */
    get positions() {
        if (this.positions_ === undefined) {
            this.positions_ = {};
        }

        return this.positions_;
    }

    /**
     * The fulltext container in DZP frontend can be resized horizontally,
     * so check if we need to recalculate positions.
     */
    onResize() {
        if (this.element != undefined && this.element.css('width') != this.lastWidth) {
            this.lastWidth = this.element.css('width');
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

        if (!this.ddbOnMapClick_) {
            this.ddbOnMapClick_ = this.ddbOnMapClick.bind(this);
        }
        this.map.on('click', this.ddbOnMapClick_);

        if (this.element === undefined) {
            this.element = $("#tx-dlf-fulltextselection");
        }
    }

    /**
     * @override
     */
    deactivate() {
        super.deactivate();
        this.map.un('click', this.ddbOnMapClick_);
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

    /**
     * @override
     */
    ddbOnMapClick(event) {
        const mouseCoordinate = this.map.getCoordinateFromPixel(event['pixel']);
        const textlineFeature = this.textlines_.coordinateToFeature(mouseCoordinate);
        const fullTextButton = document.getElementById('fulltext-button');

        // Switch to fulltext tab in DDB frontend and highlight line (which otherwise only happens on hover)
        // - fullTextLoad is a function from DDB to activate the search tab
        // - When the tab is active, the ID of the button is fulltext-button-active, so the condition pans out
        if (textlineFeature && typeof fullTextLoad === 'function' && fullTextButton !== null) {
            fullTextLoad(fullTextButton);
            this.handlers_.mapHover({
                pixel: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
            });
            this.handlers_.mapHover(event);
        }
    }
}

dlfViewerFullTextControl = ddbKitodoZeitungsportalFullTextControl;
