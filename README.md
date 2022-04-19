# DDB Kitodo Zeitungsportal

TYPO3 extension to simplify work with and make adjustments to Kitodo.Presentation at [DDB-Zeitungsportal](https://www.deutsche-digitale-bibliothek.de/newspaper/).

The JavaScript build is currently based on v3.3.0 of Kitodo.Presentation.

## Create unified JavaScript build

When building, `../dlf/` (i.e., a sibling folder of `ddb_kitodo_zeitungsportal`) must point to the code of Kitodo.Presentation that you want to use.

```bash
cd Build/
nvm use  # If you use NVM
npm ci
npm run watch
```

The result is located at `Resources/Public/JavaScript/ddbKitodoZeitungsportal.js`.

## Include TypoScript Template of ddb_kitodo_zeitungsportal

## Configure the Kitodo.Presentation Extension

Example of dlf part of configuration from LocalConfiguration.php file is available [here](Documentation/LocalConfiguration.md). It can be used as a template for plugin configuration after the installation.
