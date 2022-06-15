# DDB Kitodo Zeitungsportal

TYPO3 extension to simplify work with and make adjustments to Kitodo.Presentation at [DDB-Zeitungsportal](https://www.deutsche-digitale-bibliothek.de/newspaper/).

The JavaScript build is based on v4.0.1 (commit 6443a06) of Kitodo.Presentation.

## Create unified JavaScript/CSS build

When building, `../dlf/` (i.e., a sibling folder of `ddb_kitodo_zeitungsportal`) must point to the code of Kitodo.Presentation that you want to use.

```bash
cd Build/
nvm use  # If you use NVM
npm ci
npm run build
npm run watch  # (Alternative) Watch Mode
```

This builds:
- `Resources/Public/JavaScript/ddbKitodoZeitungsportal.js`
- `Resources/Public/Css/ddbKitodoZeitungsportal.css`

## Include TypoScript Template of ddb_kitodo_zeitungsportal

## Configure the Kitodo.Presentation Extension

Example of dlf part of configuration from LocalConfiguration.php file is available [here](Documentation/LocalConfiguration.md). It can be used as a template for plugin configuration after the installation.

## Upgrade to Kitodo.Presentation 4 (preliminary)

- Upgrade package via Composer
- Run `typo3cms database:updateschema`
