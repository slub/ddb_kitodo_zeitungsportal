/**
 * (c) Kitodo. Key to digital objects e.V. <contact@kitodo.org>
 *
 * This file is part of the Kitodo and TYPO3 projects.
 *
 * @license GNU General Public License version 3 or later.
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 */

/**
 * Get all URL query parameters for snippet links.
 * All means that it includes together params which were already supplied in the page url and params which are returned as search results.
 *
 * @param {string} baseUrl
 * @param {array} queryParams
 *
 * @returns {array} array with params in form 'param' => 'value'
 */
function getAllQueryParams(baseUrl, queryParams) {
    var params = getCurrentQueryParams(baseUrl);

    var queryParam;
    for(var i = 0; i < params.length; i++) {
        queryParam = params[i].split('=');
        if(queryParams.indexOf(decodeURIComponent(queryParam[0])) === -1) {
            queryParams.push(decodeURIComponent(queryParam[0]));
            queryParams[decodeURIComponent(queryParam[0])] = queryParam[1];
        }
    }
    return queryParams;
}

/**
 * Check if the URL is configured as SLUG
 * (id is included in main URL, not in parameter).
 * // TODO: make it more flexible
 *
 * // NOTE: Don't use this in Zeitungsportal - uid is in URL ("slug"), page is in query ("no slug")
 *
 * @param {array} element
 *
 * @returns {string}
 */
 function isUrlConfiguredAsSlug(element) {
    var baseUrl = getBaseUrl(element['uid']).split('?')[0];
    return baseUrl.indexOf(element['uid']) > -1;
}

/**
 * Get needed URL query parameters.
 * It returns array of params as objects 'param' => 'value'. It contains exactly 3 params which are taken out of search result.
 *
 * @param {array} element
 *
 * @returns {array} array with params in form 'param' => 'value'
 */
function getNeededQueryParams(element) {
    var id = $("input[id='tx-dlf-search-in-document-id']").attr('name');
    var highlightWord = $("input[id='tx-dlf-search-in-document-highlight-word']").attr('name');
    var page = $("input[id='tx-dlf-search-in-document-page']").attr('name');

    var queryParams = [];

    // NOTE: Omit in Zeitungsportal
    // if(id && !isUrlConfiguredAsSlug(element)) {
    //     queryParams.push(id);
    //     queryParams[id] = element['uid'];
    // }

    if(highlightWord) {
        queryParams.push(highlightWord);
        queryParams[highlightWord] = encodeURIComponent($("input[id='tx-dlf-search-in-document-query']").val());
    }

    // NOTE: Always do this in Zeitungsportal
    if(page /* && !isUrlConfiguredAsSlug(element) */) {
        queryParams.push(page);
        queryParams[page] = element['page'];
    }

    return queryParams;
}


/**
 * Get snippet link.
 *
 * @param {array} element
 *
 * @returns {string}
 */
function getLink(element) {
    var baseUrl = getBaseUrl(element['uid']);

    var queryParams = getNeededQueryParams(element);

    if (baseUrl.indexOf('?') > 0) {
        queryParams = getAllQueryParams(baseUrl, queryParams);
        baseUrl = baseUrl.split('?')[0];
    }

    // NOTE: This should be omitted for Zeitungsportal
    // replace last element of URL with page
    // if (isUrlConfiguredAsSlug(element)) {
    //     var url = baseUrl.split('/');
    //     url.pop();
    //     url.push(element['page']);
    //     baseUrl = url.join('/');
    // }

    var link = baseUrl + '?';

    // add query params to result link
    for(var i = 0; i < queryParams.length; i++) {
        link += encodeURIComponent(queryParams[i]) + '=' + queryParams[queryParams[i]] + '&';
    }
    link = link.slice(0, -1);
    return link;
}

/**
 * Get current page number from URL parameters or path.
 *
 * @returns {number} The current page number or defaults to "1"
 */
function getCurrentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    // NOTE: if page number is not in urlParams - set page to default "1" if no page number is given
    const defaultPage = 1;

    // Check URL parameters
    let page = urlParams.get($("input[id='tx-dlf-search-in-document-page']").attr('name')) ||
               urlParams.get('tx_dlf[page]');

    // If no parameters found, check URL path
    if (!page) {
        const pathSegments = window.location.search.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];

        // Check if last segment is a number
        if (/^\d+$/.test(lastSegment)) {
            page = lastSegment;
        }
    }

    return page ? parseInt(page, 10) || defaultPage : defaultPage;
}

/**
 * Trigger search for document loaded from hit list.
 *
 * @returns void
 */
function triggerSearchAfterHitLoad() {
    var queryParams = getCurrentQueryParams(getBaseUrl(" "));
    var searchedQueryParam = $("input[id='tx-dlf-search-in-document-highlight-word']").attr('name');

    for(var i = 0; i < queryParams.length; i++) {
        var queryParam = queryParams[i].split('=');

        if(searchedQueryParam && decodeURIComponent(queryParam[0]).indexOf(searchedQueryParam) !== -1) {
            $("input[id='tx-dlf-search-in-document-query']").val(decodeURIComponent(queryParam[1]));
            search();
            break;
        } else if(decodeURIComponent(queryParam[0]).indexOf('query') != -1) {
            $("input[id='tx-dlf-search-in-document-query']").val(decodeURIComponent(queryParam[1]));
            search();
            break;
        }
    }
}


function search() {
    resetStart();

    $('#tx-dlf-search-in-document-loading').show();
    $('#tx-dlf-search-in-document-clearing').hide();
    $('#tx-dlf-search-in-document-button-next').hide();
    $('#tx-dlf-search-in-document-button-previous').hide();

    var postToUrl = '/';
    if (typeof viewerUrl !== 'undefined') {
        postToUrl = viewerUrl;
    } else if ($('#localJsVariables').attr('viewer-url')) {
        // viewerUrl is not available in DDB viewer page.
        // but we can use this div-attribute: <div id="localJsVariables" class="off" viewer-url="https://dev-ddb.fiz-karlsruhe.de/viewerdev"  [..]/>
        postToUrl = $('#localJsVariables').attr('viewer-url');
    }
    // Send the data using post
    $.post(
        // viewerUrl is set by TypoScript and points to the viewer baseUrl
        postToUrl,
        {
            middleware: "dlf/search-in-document",
            q: $( "input[id='tx-dlf-search-in-document-query']" ).val(),
            uid: $( "input[id='tx-dlf-search-in-document-id']" ).val(),
            pid: $( "input[id='tx-dlf-search-in-document-pid']" ).val(),
            start: $( "input[id='tx-dlf-search-in-document-start']" ).val(),
            encrypted: $( "input[id='tx-dlf-search-in-document-encrypted']" ).val(),
        },
        function(data) {
            var resultItems = [];
            var resultList = '<div class="results-active-indicator"></div><ul>';
            var start = $( "input[id='tx-dlf-search-in-document-start']" ).val();
            if (data['numFound'] > 0) {
                data['documents'].forEach(function (element, i) {
                    if (start < 0) {
                        start = i;
                    }
                    if (element['snippet'].length > 0) {
                        resultItems[element['page']] = '<span class="structure">'
                            + $('#tx-dlf-search-in-document-label-page').text() + ' ' + element['page']
                            + '</span><br />'
                            + '<span class="textsnippet">'
                            + '<a href=\"' + getLink(element) + '\">' + element['snippet'] + '</a>'
                            + '</span>';
                    }
                });
                // Sort result by page.
                resultItems.sort(function (a, b) {
                    return a - b;
                });
                resultItems.forEach(function (item, index) {
                    resultList += '<li>' + item + '</li>';
                });

                addImageHighlight(data);
            } else {
                resultList += '<li class="noresult"></li>';
            }
            resultList += '</ul>';
            resultList += getNavigationButtons(start, data['numFound']);
            $('#tx-dlf-search-in-document-results').html(resultList);
            $('.noresult').text($('#tx-dlf-search-in-document-label-noresult').text());
            $('.button-previous').attr('value', $('#tx-dlf-search-in-document-label-previous').text());
            $('.button-next').attr('value', $('#tx-dlf-search-in-document-label-next').text());
        },
        "json"
    )
    .done(function (data) {
        $('#tx-dlf-search-in-document-loading').hide();
        $('#tx-dlf-search-in-document-clearing').show();
    });
}

function clearSearch() {
    $('#tx-dlf-search-in-document-results ul').remove();
    $('.results-active-indicator').remove();
    $('#tx-dlf-search-in-document-query').val('');
}

$(document).ready(function() {
    if(document.getElementById('tx-dlf-search-in-document-query')) {
        document.getElementById('tx-dlf-search-in-document-query').addEventListener("keydown", function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                search();
            }
        });

        triggerSearchAfterHitLoad();
    }
});
