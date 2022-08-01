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
        var OV_WIDTH = 122 - 2 * 3;

        var extent = ol.extent.createEmpty();
        for (let i = 0; i < this.images.length; i++) {
            ol.extent.extend(extent, [0, -this.images[i].height, this.images[i].width, 0]);
        }

        var width = ol.extent.getWidth(extent);
        var height = ol.extent.getHeight(extent);

        // The resolution is the number of projection units (-> pixels on source image)
        // per screen pixel.
        var resolution = width / OV_WIDTH;

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
                var ov_height = Math.ceil(height / width * OV_WIDTH);
                map.style.cssText += ";width: " + OV_WIDTH + "px !important; height: " + ov_height + "px !important;";
                ovmap.getOverviewMap().updateSize();
            }
        });

        return ovmap;
    }
}

dlfViewer = ddbKitodoZeitungsportalViewer;
