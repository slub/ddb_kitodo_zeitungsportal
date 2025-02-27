
module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    const jsFiles = {
        "Resources/Public/JavaScript/ddbKitodoZeitungsportal.js" : [
            // prevent multiple evaluation of the same script
            'Resources/Private/JavaScript/ScriptLoader.js',

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
            '../dlf/Resources/Public/JavaScript/PageView/SearchInDocument.js',   // based on dlf/SearchInDocument
            'Resources/Private/JavaScript/Kitodo/PageView/SearchInDocument.js',  // extend and override with DDB SearchInDocument

            // highlight more than one word separated by ' ' and keeping search phrase in search field
            '../dlf/Resources/Public/JavaScript/PageView/PageView.js',

            // Customize OverviewMap control
            'Resources/Private/JavaScript/Kitodo/PageView/PageView.js'
        ],
    };

    const cssFiles = {
        "Resources/Public/Css/ddbKitodoZeitungsportal.css" : [
            "../dlf/Resources/Public/JavaScript/OpenLayers/openlayers.css",
            "Resources/Private/Less/all.less",
        ],
    };

    grunt.initConfig({
        less: {
            build: {
                options: {
                    sourceMap: true,
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: cssFiles
            },
            development: {
                options: {
                    sourceMap: true,
                    compress: false,
                    yuicompress: false,
                    optimization: 0,
                    ieCompat: false
                },
                files: cssFiles
            }
        },
        terser: {
            build: {
                options: {
                    compress: false
                },
                files: jsFiles
            },
            development: {
                options: {
                    format: {
                        beautify: true,
                        indent_level: 2,
                        comments: true
                    },
                    compress: false,
                    mangle: false
                },
                files: jsFiles
            }
        },
        watch: {
            styles: {
                files: [
                    'Resources/Private/Less/**/*.less',
                    '../dlf/Resources/Public/JavaScript/**/*.css'
                ],
                tasks: ['less:development'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: [
                    'Resources/Private/JavaScript/**/*.js',
                    '../dlf/Resources/Public/JavaScript/**/*.js'
                ],
                tasks: ['terser:development'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.file.setBase('../');
    grunt.registerTask('build', ['terser:build', 'less:build']);
    grunt.registerTask('development', ['terser:development', 'less:development']);
    grunt.registerTask('debugging', ['terser:development', 'less:development', 'watch']);
};
