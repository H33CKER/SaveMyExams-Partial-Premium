// ==UserScript==
// @name         SaveMyExams - Partial Premium
// @author       H33CKER
// @namespace    https://github.com/H33CKER
// @version      2.1
// @description  SaveMyExams - Partial Premium - Clean UI customisation
// @match        *://*.savemyexams.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/H33CKER/SaveMyExams-Partial-Premium/main/SaveMyExams-Premium.user.js
// @updateURL    https://raw.githubusercontent.com/H33CKER/SaveMyExams-Partial-Premium/main/SaveMyExams-Premium.user.js
// ==/UserScript==

(function () {
    'use strict';

    const selectors = [
        'button[aria-label="Download notes"]',
        'a[href="/welcome/your-plan/"]',
        'div[class*="DownloadRibbon_wrapper"]'
    ];

    function resetViewCounters() {
        localStorage.removeItem('SME.topic-question-views');
        localStorage.removeItem('SME.topic-question-part-solution-views');
        localStorage.removeItem('SME.revision-note-views');
        localStorage.removeItem('SME.first-viewed-topic-question-at');
    }

    function processTabPanes(root) {
        if (!(root instanceof Element)) return;

        const panes = [];

        if (root.matches('div[id*="tabpane" i]')) {
            panes.push(root);
        }

        panes.push(...root.querySelectorAll('div[id*="tabpane" i]'));

        panes.forEach(tabPane => {
            tabPane.querySelectorAll('[class*="blur" i]').forEach(element => {
                element.className = '';
            });

            tabPane.querySelectorAll('[class*="limit-wall_wrapper" i]').forEach(element => {
                element.remove();
            });
        });
    }

    function removeTargets(root) {
        if (!(root instanceof Element)) return;

        if (root.matches(selectors.join(','))) {
            root.remove();
            return;
        }

        root.querySelectorAll(selectors.join(',')).forEach(element => {
            element.remove();
        });
    }

    function processElement(root) {
        if (!(root instanceof Element)) return;

        removeTargets(root);
        processTabPanes(root);
    }

    resetViewCounters();
    setInterval(resetViewCounters, 1000);

    processElement(document.documentElement);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                processElement(node);
            }

            if (
                mutation.type === 'attributes' &&
                mutation.target instanceof Element
            ) {
                processTabPanes(
                    mutation.target.closest('div[id*="tabpane" i]') ||
                    mutation.target
                );
            }
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });

})();