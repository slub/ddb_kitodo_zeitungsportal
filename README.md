# DDB Kitodo Zeitungsportal

TYPO3 extension to simplify work with and make adjustments to Kitodo.Presentation at [DDB-Zeitungsportal](https://www.deutsche-digitale-bibliothek.de/newspaper/).

The JavaScript build is based on 5.0.x of Kitodo.Presentation.

## System requirements

* TYPO3 CMS 10.4 ELTS to 11.5 LTS
* Kitodo.Presentation 5.0.x only (not compatible with version 5.1 or higher yet)
* PHP 7.4.x - 8.3.x
* Apache Solr 8.x
* See [Kitodo.Presentation 5.0.x Requirements](https://github.com/kitodo/kitodo-presentation/tree/5.0.x)

> **Important:** This extension requires exactly Kitodo.Presentation 5.0.x. It is not compatible with Kitodo.Presentation 5.1 or higher versions for now.

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

## Include and Configure TypoScript Template of ddb_kitodo_zeitungsportal

### Include the Template of ddb_kitodo_zeitungsportal

Select the "Includes" tab in Template module for your root page (clicking on "Edit the whole template record")
In the "Include static (from extensions)" section:
  - First select "Toolbox Default Tool Templates (dlf)"
  - Then select "DDB: Kitodo Zeitungsportal (ddb_kitodo_zeitungsportal)"

> **Important:** The order of inclusion matters. Make sure Kitodo.Presentation is included before DDB Kitodo Zeitungsportal.

### Setup Constants

Edit "Constants" field in the template editor and add these configuration values:
```typoscript
plugin.ddb_kitodo_zeitungsportal {
  viewerPid = [UID of your viewer page]
  configPid = [UID of your Kitodo.Presentation configuration page]
  solrCore = [UID of your Solr core]
  baseUrl = https://domain.com/ [page url on which the viewer will be visible with trailing slash]
}
```

### Add Search Configuration
Edit "Setup" field in the template editor and add these lines to your TypoScript setup:
```typoscript
# FrontendUrl + /newspaper/item
plugin.tx_dlf_searchindocumenttool.settings.searchUrl = https://domain.com/newspaper/item
# Backend-API-URL + path to source-record with *id*
plugin.tx_dlf_searchindocumenttool.settings.documentIdUrlSchema = https://api.com/items/*id*/source/record
```


After configure and including the template:
- Clear all TYPO3 caches
- Check if JavaScript and CSS files are properly loaded in frontend

## Configure the Kitodo.Presentation Extension

Example of the dlf part of nested configuration from LocalConfiguration.php file is available [here](Documentation/LocalConfiguration.md). It can be used as a template for plugin configuration after the installation.

## Upgrade to Kitodo.Presentation 5.0.x

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
