/**
 * Script initialization check for DDB Zeitungsportal Viewer
 *
 * This function ensures that the DDB Zeitungsportal Viewer is initialized only once.
 * Even though the JS file may be loaded twice in the frontend, make sure it at least isn't executed twice.
 * This makes things less complicated when trying to override, for example, dlfViewer in PageView.js.
 * It sets a flag on the global window object to indicate that the relevant scripts have been loaded,
 * and if the module is re-initialized, it logs a warning.
 *
 */
(function() {
    if (window.DDB_KITODO_SCRIPTS_LOADED === true) {
        throw new Error(
            'DDB Zeitungsportal Viewer has already been initialized.\n' +
            'Multiple initialization may cause unexpected behavior.\n' +
            'Please check your script inclusions.'
        );
    }

    window.DDB_KITODO_SCRIPTS_LOADED = true;
})();
