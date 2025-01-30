# Notes on Development

## Frontend

- Bundles for all used JS and CSS code are built using Grunt.
  The input and output files are configured in `Build/Gruntfile.js`.
  In particular, it includes scripts from Kitodo.Presentation and overrides some of them with customizations.

- Input JS/Less code is located at `Resources/Private/{JavaScript,Less}`.
  Output is at `Resources/Public/{JavaScript,Css}`.

- Configuration and customization of Kitodo plugins:
  - `Configuration/TypoScript/Plugins/setup.typoscript`
  - `Resources/Private/Templates/`
  - Viewer template in TYPO3 backend (check constants and setup)

- There are two additional query parameters (look for `request.getQueryParams()`):
  - `html=1`: By default, anything not inside the `<body>` is stripped. By setting `html=1`, the full `<head>`/`<html>` tags are instead included.
  - `debug=1`: In addition to `html=1`, this includes jQuery on the page. Use this to display the viewer.
