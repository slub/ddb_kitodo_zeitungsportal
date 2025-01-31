// Even though the JS file may be loaded twice in the frontend, make sure it at least isn't executed twice.
// This makes things less complicated when trying to override, for example, dlfViewer in PageView.js.
// TODO: Dispense of this hack

if (window.DDB_KITODO_SCRIPTS_LOADED === true) {
    throw new Error("Nevermind.");
}

window.DDB_KITODO_SCRIPTS_LOADED = true;
