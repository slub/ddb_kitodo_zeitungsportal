/**
 * (c) Kitodo. Key to digital objects e.V. <contact@kitodo.org>
 *
 * This file is part of the Kitodo and TYPO3 projects.
 *
 * @license GNU General Public License version 3 or later.
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */

ddbKitodoZeitungsportalViewer = class extends dlfViewer {

    /**
     * Override: Use coordinates search instead of words.
     * Forwards the search to dlfUtils.searchFeatureCollectionForCoordinates
     *
     * @see dlfUtils.searchFeatureCollectionForCoordinates
     */
    searchFeatures(stringFeatures, value) {
        return dlfUtils.searchFeatureCollectionForCoordinates(stringFeatures, value);
    }

    /**
     * Override: Create OpenLayers control for Zeitungsportal.
     */
    createControl(controlName, layers) {
        if (controlName === 'OverviewMap') {
            return this.createOverviewMap(layers);
        } else {
            return super.createControl(controlName, layers);
        }
    }

    /**
     * Create overview map as modified for Zeitungsportal.
     *
     * In particular, it should have a fixed view of the full page, no zooming.
     */
    createOverviewMap(layers) {
        // DDB frontend sets a border-box width of 122px, and we have a border of 3px
        var ovWidth = 122 - 2 * 3;

        var extent = ol.extent.createEmpty();
        for (let i = 0; i < this.images.length; i++) {
            ol.extent.extend(extent, [0, -this.images[i].height, this.images[i].width, 0]);
        }

        var width = ol.extent.getWidth(extent);
        var height = ol.extent.getHeight(extent);

        // The resolution is the number of projection units (-> pixels on source image)
        // per screen pixel.
        var resolution = width / ovWidth;

        var ovmap = new ol.control.OverviewMap({
            tipLabel: this.dic['overview-map'],
            label: '+',
            collapseLabel: '–',
            collapsed: false,
            layers: layers.map(dlfUtils.cloneOlLayer),
            view: new ol.View({
                center: ol.extent.getCenter(extent),
                extent: extent,
                projection: new ol.proj.Projection({
                    code: 'kitodo-image',
                    units: 'pixels',
                    extent: extent
                }),
                showFullExtent: false,
                minResolution: resolution,
                maxResolution: resolution,
                resolution: resolution
            })
        });

        var dic = this.dic;
        var button = ovmap.element.querySelector('button');
        if (button !== null) {
            var updateTooltip = function () {
                if (ovmap.getCollapsed()) {
                    button.title = dic['overview-map.show'];
                } else {
                    button.title = dic['overview-map.hide'];
                }
            };

            button.addEventListener('click', updateTooltip);
            updateTooltip();
        }

        // Resize the overview map to fit the page size, assuming a fixed width
        $(window).on('map-loadend', function () {
            var map = document.querySelector('.ol-overviewmap-map');
            if (map !== null) {
                var ovHeight = Math.ceil(height / width * ovWidth);
                map.style.cssText += ";width: " + ovWidth + "px !important; height: " + ovHeight + "px !important;";
                ovmap.getOverviewMap().updateSize();
            }
        });

        return ovmap;
    }
}

dlfViewer = ddbKitodoZeitungsportalViewer;
