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
 * @return {ol.style.Style}
 */
dlfViewerOLStyles.textlineStyle = function() {

    return new ol.style.Style({
        'stroke': new ol.style.Stroke({
            'color': 'rgba(0,59,80,1)',
            'width': 1
        })
    });

};

/**
 * @return {ol.style.Style}
 */
dlfViewerOLStyles.wordStyle = function() {

    return new ol.style.Style({
        'stroke': new ol.style.Stroke({
            'color': 'rgba(0,59,80,0.8)',
            'width': 1
        }),
        'fill': new ol.style.Fill({
            'color': 'rgba(0,59,80,0.25)'
        })
    });

};
