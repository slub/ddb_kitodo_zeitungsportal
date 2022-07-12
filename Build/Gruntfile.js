
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
                        "../dlf/Resources/Public/Javascript/OpenLayers/openlayers.css",
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
                        '../dlf/Resources/Public/Javascript/jQueryUI/jquery-ui-mouse-slider-resizable-autocomplete.js',
                        '../dlf/Resources/Public/Javascript/OpenLayers/openlayers.js',
                        // Viewer
                        // highlight exact word in search results
                        '../dlf/Resources/Public/Javascript/PageView/Utility.js',
                        '../dlf/Resources/Public/Javascript/PageView/OL.js',
                        // Override text highlighting color
                        '../dlf/Resources/Public/Javascript/PageView/OLStyles.js',
                        'Resources/Private/JavaScript/Kitodo/PageView/OLStyles.js',
                        '../dlf/Resources/Public/Javascript/PageView/OLSources.js',
                        '../dlf/Resources/Public/Javascript/PageView/AltoParser.js',
                        '../dlf/Resources/Public/Javascript/PageView/AnnotationParser.js',
                        '../dlf/Resources/Public/Javascript/PageView/AnnotationControl.js',
                        '../dlf/Resources/Public/Javascript/PageView/ImageManipulationControl.js',
                        '../dlf/Resources/Public/Javascript/PageView/FulltextDownloadControl.js',
                        // custom scrolling - extend and override base FulltextControl
                        '../dlf/Resources/Public/Javascript/PageView/FulltextControl.js',
                        'Resources/Private/JavaScript/Kitodo/PageView/FulltextControl.js',
                        '../dlf/Resources/Public/Javascript/PageView/FullTextUtility.js',
                        // use standard input instead of submit button
                        'Resources/Private/JavaScript/Kitodo/PageView/SearchInDocument.js',
                        // highlight more than one word separated by ' ' and keeping search
                        // phrase in search field
                        '../dlf/Resources/Public/Javascript/PageView/PageView.js',
                        // Customize OverviewMap control
                        'Resources/Private/JavaScript/Kitodo/PageView/PageView.js'
                    ],
                }
            }
        },
        watch: {
            styles: {
                files: ['Resources/Private/Less/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['Resources/Private/JavaScript/**/*.js'],
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
