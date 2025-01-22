
module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        less: {
            development: {
                options: {
                    sourceMap: true,
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "Resources/Public/Css/ddbKitodoZeitungsportal.css" : [
                        "../dlf/Resources/Public/JavaScript/OpenLayers/openlayers.css",
                        "Resources/Private/Less/all.less",
                    ],
                }
            }
        },
        terser: {
            development: {
                options: {
                    compress: false,
                },
                files: {
                    "Resources/Public/JavaScript/ddbKitodoZeitungsportal.js" : [
                        // hack to prevent multiple evaluation of the same script
                        'Resources/Private/JavaScript/hackEvalOnlyOnce.js',

                        // jQuery UI and OpenLayers
                        '../dlf/Resources/Public/JavaScript/jQueryUI/jquery-ui-mouse-slider-resizable-autocomplete.js',
                        '../dlf/Resources/Public/JavaScript/OpenLayers/openlayers.js',

                        // Viewer

                        // highlight exact word in search results
                        '../dlf/Resources/Public/JavaScript/PageView/Utility.js',
                        '../dlf/Resources/Public/JavaScript/PageView/OL.js',

                        // Override text highlighting color
                        '../dlf/Resources/Public/JavaScript/PageView/OLStyles.js',
                        'Resources/Private/JavaScript/Kitodo/PageView/OLStyles.js',
                        '../dlf/Resources/Public/JavaScript/PageView/OLSources.js',
                        '../dlf/Resources/Public/JavaScript/PageView/AltoParser.js',
                        '../dlf/Resources/Public/JavaScript/PageView/AnnotationParser.js',
                        '../dlf/Resources/Public/JavaScript/PageView/AnnotationControl.js',
                        '../dlf/Resources/Public/JavaScript/PageView/ImageManipulationControl.js',
                        '../dlf/Resources/Public/JavaScript/PageView/FulltextDownloadControl.js',

                        // custom scrolling - extend and override base FulltextControl
                        '../dlf/Resources/Public/JavaScript/PageView/FulltextControl.js',
                        'Resources/Private/JavaScript/Kitodo/PageView/FulltextControl.js',
                        '../dlf/Resources/Public/JavaScript/PageView/FullTextUtility.js',

                        // use standard input instead of submit button
                        '../dlf/Resources/Public/JavaScript/PageView/SearchInDocument.js',   // base on dlf/SearchInDocument
                        'Resources/Private/JavaScript/Kitodo/PageView/SearchInDocument.js',  // extend and override with DDB SearchInDocument

                        // highlight more than one word separated by ' ' and keeping search phrase in search field
                        '../dlf/Resources/Public/JavaScript/PageView/PageView.js',

                        // Customize OverviewMap control
                        'Resources/Private/JavaScript/Kitodo/PageView/PageView.js'
                    ],
                }
            }
        },
        watch: {
            styles: {
                files: [
                    'Resources/Private/Less/**/*.less',
                    '../dlf/Resources/Public/JavaScript/**/*.css'
                ],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: [
                    'Resources/Private/JavaScript/**/*.js',
                    '../dlf/Resources/Public/JavaScript/**/*.js'
                ],
                tasks: ['terser'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.file.setBase('../')
    grunt.registerTask('default', ['terser','watch']);
};
