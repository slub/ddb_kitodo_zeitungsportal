<?php
defined('TYPO3_MODE') or die();

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
    'ddb_kitodo_zeitungsportal',
    'Configuration/TypoScript',
    'DDB: Kitodo Zeitungsportal'
);
