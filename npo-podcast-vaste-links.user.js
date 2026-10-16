// ==UserScript==
// @name         NPO Podcast - Vaste links toevoegen
// @namespace    https://podcast.npo.nl/
// @version      1.0.3
// @updateURL    https://raw.githubusercontent.com/DavidBoogerd/ongelooflijke-redactietool/main/npo-podcast-vaste-links.user.js
// @downloadURL  https://raw.githubusercontent.com/DavidBoogerd/ongelooflijke-redactietool/main/npo-podcast-vaste-links.user.js
// @description  Voegt lokaal een vast HTML-blok toe aan de TinyMCE-omschrijving.
// @match        https://podcast.npo.nl/admin/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    /*
     * PAS ALLEEN DEZE VARIABELE AAN.
     * Laat de marker in het blok staan om dubbele invoer te voorkomen.
     */
    const STANDARD_LINKS_HTML = `
<!-- ongelooflijke-standaardlinks -->

🔎 Doorzoek al onze afleveringen op thema met onze <a href="https://www.eo.nl/campagne/welke-de-ongelooflijke-podcast-aflevering-luister-jij-vandaag">archieftool</a>.<br>
📜 Meld je aan voor onze nieuwsbrief en lees verdiepende Ongelooflijke artikelen via ons <a href="https://deongelooflijke.substack.com/">online platform (Substack)</a>.<br>
🏛 Luister nu ook onze spin-off <a href="https://www.eo.nl/podcast/de-ongelooflijke-geschiedenis/afleveringen">De Ongelooflijke Geschiedenis</a>, met Beatrice de Graaf en Stefan Paas!<br>
📺 Bekijk onze gesprekken op <a href="https://www.youtube.com/@deongelooflijke">YouTube</a><br>
📱 Volg De Ongelooflijke op <a href="https://www.instagram.com/deongelooflijke/">Instagram</a><br>
📱 Volg David op <a href="https://www.linkedin.com/in/david-boogerd-44207a7b?originalSubdomain=nl">LinkedIn</a> of <a href="https://bsky.app/profile/davidboogerd.bsky.social">Blue Sky</a><br>
📱 Volg Stefan op <a href="https://www.linkedin.com/in/stefan-paas-51373a5/">LinkedIn</a><br>
<br>
Relevante afleveringen:
`;

    const MARKER = 'ongelooflijke-standaardlinks';
    const BUTTON_ID = 'npo-vaste-links-button';
    const TOOLBAR_ID = 'npo-vaste-links-toolbar';
    const PREFIX = '[NPO vaste links]';
    const TWO_BLANK_LINES = '<p><br></p><p><br></p>';

    const log = (...args) => console.log(PREFIX, ...args);
    const warn = (...args) => console.warn(PREFIX, ...args);

    function cleanText(value) {
        return String(value || '')
            .replace(/\s+/g, ' ')
            .replace(/[\s:*]+$/, '')
            .trim()
            .toLowerCase();
    }

    function descriptionLabels() {
        return Array.from(document.querySelectorAll(
            'label, legend, th, dt, .form-label, [data-label]'
        )).filter(element => {
            const text = cleanText(element.textContent);
            return text === 'omschrijving' || text.startsWith('omschrijving ');
        });
    }

    function labelTarget(label) {
        const forId = label.getAttribute('for');
        if (forId && document.getElementById(forId)) {
            return document.getElementById(forId);
        }
        return label.querySelector('textarea, [contenteditable="true"]');
    }

    function fieldContainer(label) {
        return label.closest(
            '.form-group, .form-field, .field, .control-group, .mb-3, [class*="form-group"], [class*="form-field"]'
        ) || label.parentElement;
    }

    function tinyMCEGlobal() {
        return window.tinymce || window.tinyMCE || null;
    }

    function editorSource(editor) {
        return editor.targetElm || editor.getElement?.() || null;
    }

    function editorBelongsToDescription(editor, labels) {
        const source = editorSource(editor);
        if (!source) return false;

        const identity = cleanText([
            source.id,
            source.getAttribute('name'),
            source.getAttribute('aria-label'),
            source.getAttribute('placeholder')
        ].filter(Boolean).join(' '));

        if (identity.includes('omschrijving')) return true;

        return labels.some(label => {
            const target = labelTarget(label);
            const forId = label.getAttribute('for');
            const field = fieldContainer(label);
            const editorBox = editor.getContainer?.();

            return target === source ||
                (forId && (forId === source.id || forId === editor.id)) ||
                (field && editorBox && field.contains(source) && field.contains(editorBox));
        });
    }

    function findTinyMCEEditor() {
        const tinyMCE = tinyMCEGlobal();
        if (!tinyMCE) return null;

        const editors = Array.from(tinyMCE.editors || []).filter(editor => {
            try {
                return editor && editor.initialized !== false && editor.getBody?.();
            } catch (_) {
                return false;
            }
        });

        const labels = descriptionLabels();
        const matches = editors.filter(editor =>
            editorBelongsToDescription(editor, labels)
        );

        if (matches.length) {
            if (matches.length > 1) {
                warn('Meerdere passende editors gevonden; de eerste wordt gebruikt.');
            }
            return { type: 'tinymce', editor: matches[0] };
        }

        // Alleen terugvallen op de enige editor; kies nooit willekeurig uit meerdere.
        if (editors.length === 1) {
            log('De enige aanwezige TinyMCE-editor wordt gebruikt.');
            return { type: 'tinymce', editor: editors[0] };
        }

        if (editors.length > 1) {
            warn('Omschrijving niet betrouwbaar te herkennen tussen editors:',
                editors.map(editor => editor.id));
        }
        return null;
    }

    function findIframeFallback() {
        for (const label of descriptionLabels()) {
            const field = fieldContainer(label);
            const target = labelTarget(label) ||
                field?.querySelector('textarea, [contenteditable="true"]');

            let frame = null;
            if (target?.id) frame = document.getElementById(`${target.id}_ifr`);
            if (!frame && field) {
                const frames = field.querySelectorAll('iframe');
                if (frames.length === 1) frame = frames[0];
            }

            try {
                if (frame?.contentDocument?.body) {
                    return { type: 'iframe', frame, target, field };
                }
            } catch (error) {
                warn('De TinyMCE-iframe is niet toegankelijk.', error);
            }
        }
        return null;
    }

    function findDescriptionEditor() {
        return findTinyMCEEditor() || findIframeFallback();
    }

    function editorAnchor(found) {
        if (found.type === 'tinymce') {
            return found.editor.getContainer?.() || editorSource(found.editor);
        }
        return found.frame.closest('.tox-tinymce, .mce-tinymce, [role="application"]') ||
            found.field || found.frame;
    }

    function getHtml(found) {
        if (found.type === 'tinymce') {
            return found.editor.getContent({ format: 'html' });
        }
        return found.frame.contentDocument.body.innerHTML;
    }

    function addWithTinyMCE(editor, html) {
        editor.focus();

        // Zet de selectie aan het absolute einde zonder bestaande inhoud te vervangen.
        editor.selection.select(editor.getBody(), true);
        editor.selection.collapse(false);

        const insert = () => editor.insertContent(html);
        if (editor.undoManager?.transact) editor.undoManager.transact(insert);
        else insert();

        editor.nodeChanged?.();
        editor.setDirty?.(true);

        // Ondersteun zowel nieuwere als oudere TinyMCE-versies.
        if (typeof editor.dispatch === 'function') {
            editor.dispatch('input');
            editor.dispatch('change');
        } else if (typeof editor.fire === 'function') {
            editor.fire('input');
            editor.fire('change');
        }

        // Dit synchroniseert alleen het onderliggende formulierveld.
        // Het slaat niets op de NPO-server op.
        editor.save?.();

        const source = editorSource(editor);
        source?.dispatchEvent(new Event('input', { bubbles: true }));
        source?.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function addWithIframeFallback(found, html) {
        const body = found.frame.contentDocument.body;

        // insertAdjacentHTML laat alle bestaande nodes ongemoeid.
        body.insertAdjacentHTML('beforeend', html);
        body.dispatchEvent(new Event('input', { bubbles: true }));
        body.dispatchEvent(new Event('change', { bubbles: true }));

        if (found.target) {
            if ('value' in found.target) found.target.value = body.innerHTML;
            else found.target.innerHTML = body.innerHTML;
            found.target.dispatchEvent(new Event('input', { bubbles: true }));
            found.target.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function toast(message, status = 'info') {
        document.getElementById('npo-vaste-links-toast')?.remove();

        const element = document.createElement('div');
        element.id = 'npo-vaste-links-toast';
        element.textContent = message;
        element.setAttribute('role', 'status');
        Object.assign(element.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '2147483647',
            maxWidth: '380px',
            padding: '11px 14px',
            borderRadius: '6px',
            color: '#fff',
            background: status === 'error' ? '#a82424' :
                (status === 'success' ? '#237a3b' : '#333'),
            boxShadow: '0 3px 12px rgba(0,0,0,.25)',
            font: '14px/1.4 system-ui, sans-serif'
        });
        document.body.appendChild(element);
        window.setTimeout(() => element.remove(), 4500);
    }

    function addStandardLinks() {
        const found = findDescriptionEditor();
        if (!found) {
            warn('Knop geklikt, maar de editor Omschrijving is niet gevonden.');
            toast('De editor Omschrijving kon niet worden gevonden.', 'error');
            return;
        }

        try {
            const currentHtml = getHtml(found);
            log('Knop geklikt. Methode:', found.type,
                'HTML-lengte:', currentHtml.length);

            if (currentHtml.includes(MARKER)) {
                log('Marker gevonden; er wordt niets toegevoegd.');
                toast('De vaste links staan al in deze omschrijving.');
                return;
            }

            const htmlToAdd = TWO_BLANK_LINES + STANDARD_LINKS_HTML.trim();
            if (found.type === 'tinymce') addWithTinyMCE(found.editor, htmlToAdd);
            else addWithIframeFallback(found, htmlToAdd);

            log('Standaardblok toegevoegd; input/change-events zijn verzonden.');
            toast('De vaste links zijn toegevoegd.', 'success');
        } catch (error) {
            console.error(PREFIX, 'Toevoegen is mislukt.', error);
            toast('Toevoegen is mislukt. Bekijk de browserconsole.', 'error');
        }
    }

    function placeButton() {
        if (document.getElementById(BUTTON_ID)) return true;

        const found = findDescriptionEditor();
        if (!found) return false;

        const anchor = editorAnchor(found);
        if (!anchor?.parentNode) return false;

        document.getElementById(TOOLBAR_ID)?.remove();

        const toolbar = document.createElement('div');
        toolbar.id = TOOLBAR_ID;
        toolbar.style.marginBottom = '8px';

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.type = 'button';
        button.textContent = '🔗 Vaste links toevoegen';
        button.title = 'Voeg het standaardblok onderaan de omschrijving toe';
        Object.assign(button.style, {
            border: '1px solid #777',
            borderRadius: '4px',
            padding: '7px 11px',
            background: '#fff',
            color: '#222',
            cursor: 'pointer',
            font: '600 13px/1.2 system-ui, sans-serif'
        });
        button.addEventListener('click', addStandardLinks);

        toolbar.appendChild(button);
        anchor.parentNode.insertBefore(toolbar, anchor);
        log('Knop geplaatst. Gevonden via:', found.type);
        return true;
    }

    let debounceTimer;
    function scheduleButtonCheck() {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(placeButton, 150);
    }

    function start() {
        log('Userscript gestart op', location.href);
        placeButton();

        // Voor editors/formulieren die pas later dynamisch worden toegevoegd.
        new MutationObserver(scheduleButtonCheck).observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // Extra retry gedurende de eerste 30 seconden.
        let attempts = 0;
        const retry = window.setInterval(() => {
            attempts += 1;
            if (placeButton() || attempts >= 30) {
                window.clearInterval(retry);
                if (attempts >= 30 && !document.getElementById(BUTTON_ID)) {
                    warn('Na 30 seconden is de editor Omschrijving niet gevonden.');
                }
            }
        }, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }
})();
