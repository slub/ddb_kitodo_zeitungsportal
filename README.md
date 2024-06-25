# DDB Kitodo Zeitungsportal

TYPO3 extension to simplify work with and make adjustments to Kitodo.Presentation at [DDB-Zeitungsportal](https://www.deutsche-digitale-bibliothek.de/newspaper/).

The JavaScript build is based on v5.0.1 (commit 74f6343) of Kitodo.Presentation.

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

## Upgrade to Kitodo.Presentation v4 / v5 (preliminary)

- Upgrade package via Composer
- In `LocalConfiguration.php`:
  ```php
  'FE' => [
      'cacheHash' => [
          'requireCacheHashPresenceParameters' => [
              'tx_dlf[id]',
          ],
      ],
  ],
  ```
  This could be set in command line:
  ```bash
  vendor/bin/typo3cms configuration:set --json 'FE/cacheHash/requireCacheHashPresenceParameters' '["tx_dlf[id]"]'
  ```
- Update database:
  - `vendor/bin/typo3cms database:updateschema`
- Update setup of viewer template:
  ```typoscript
  // Before
  plugin.tx_dlf_searchindocumenttool.documentIdUrlSchema = ...
  plugin.tx_dlf_searchindocumenttool.searchUrl = ...

  // After
  plugin.tx_dlf_searchindocumenttool.settings.documentIdUrlSchema = ...
  plugin.tx_dlf_searchindocumenttool.settings.searchUrl = ...
  ```

## Maintainer
typo3@slub-dresden.de
