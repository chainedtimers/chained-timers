/* ==========================================================================
   Chained Timers — localisation (v1.4.25)
   ==========================================================================

   English is the source language: every UI string in the app is written
   in English and passed through T() (or, for the static markup in
   index.html, translated in place by I18n.applyStatic). A language
   dictionary maps the ENGLISH TEXT to its translation, so a string that
   has no entry simply stays English — nothing ever renders as a key.

   Placeholders use {name}: T('Segment {i} of {n}', { i: 2, n: 5 }).
   Plurals go through Tn(count, '{n} chain', '{n} chains') which picks
   the form with the language's own rule (French treats 0 and 1 as
   singular) and then translates it.

   Template chains (names, descriptions, segment names) have their own
   table, read through I18n.tpl(), because their words ("Focus", "Hold",
   "Round"…) also exist as UI labels with a different meaning.

   Language choice: Settings → Language is 'auto' (default — follow the
   device / browser language), 'en' or 'fr'. Only the UI is translated;
   user-typed chain and segment names are never touched.
   ========================================================================== */

(() => {
'use strict';

const FR = {
  // ---- Library -----------------------------------------------------------
  'The interval forge.': 'La forge à intervalles.',
  'Settings': 'Réglages',
  'Exit selection': 'Quitter la sélection',
  'Select chains': 'Sélectionner des chaînes',
  'Max {n} at once': '{n} max. à la fois',
  '{n} selected': { one: '{n} sélectionnée', other: '{n} sélectionnées' },
  'Delete selected': 'Supprimer la sélection',
  'Start selected': 'Lancer la sélection',
  '{n} chain': '{n} chaîne',
  '{n} chains': '{n} chaînes',
  '{dur} stored': '{dur} au total',
  '— total': '— au total',
  '— chains': '— chaînes',
  'No chains yet.': 'Aucune chaîne pour l’instant.',
  'Forge your first chain — string together intervals and let the app conduct your workout, breathwork, or study session.':
    'Forgez votre première chaîne : enchaînez des intervalles et laissez l’appli rythmer votre entraînement, votre respiration ou vos révisions.',
  '+ New chain': '+ Nouvelle chaîne',
  'Browse templates': 'Parcourir les modèles',
  'Chains': 'Chaînes',
  'New chain': 'Nouvelle chaîne',
  'Templates': 'Modèles',
  'Reorder chain': 'Déplacer la chaîne',
  'Start chain': 'Lancer la chaîne',
  '{n} segment': '{n} segment',
  '{n} segments': '{n} segments',
  '×{n} loop': '×{n} boucle',
  '×{n} loops': '×{n} boucles',
  'nested': 'imbriquée',
  'Focus': 'En premier',
  'Up to {n} at once — dropped "{name}".': '{n} max. à la fois — « {name} » retirée.',
  'a chain': 'une chaîne',
  'this chain': 'cette chaîne',
  'Delete "{name}"? This cannot be undone.': 'Supprimer « {name} » ? Cette action est irréversible.',
  'Delete {n} chains? This cannot be undone.': 'Supprimer {n} chaînes ? Cette action est irréversible.',
  'Chain deleted': 'Chaîne supprimée',
  '{n} chains deleted': '{n} chaînes supprimées',
  '"{name}" deleted': '« {name} » supprimée',
  'Undo': 'Annuler',
  'Can\'t delete "{name}" — used by {names}': 'Impossible de supprimer « {name} » — utilisée par {names}',
  ' +{n} more': ' +{n} autre(s)',
  'Segment {i} of {n}': 'Segment {i} sur {n}',
  'next: {name}': 'suivant : {name}',
  'segment': 'segment',
  'Stop "{name}"?': 'Arrêter « {name} » ?',
  'Stop "{name}"? Another chain will continue.': 'Arrêter « {name} » ? Une autre chaîne continuera.',
  'Stop this chain?': 'Arrêter cette chaîne ?',

  // ---- Engine / toasts ---------------------------------------------------
  '{n} chains already running — stop one to start another.':
    '{n} chaînes déjà en cours — arrêtez-en une pour en lancer une autre.',
  'Chain has no segments': 'Cette chaîne n’a aucun segment',
  '{names} already running — skipped from synced start.': '{names} déjà en cours — non relancée(s).',
  '{n} chains already running.': '{n} chaînes déjà en cours.',
  'Up to {n} chains at once.': '{n} chaînes max. à la fois.',
  'Restored chain': 'Chaîne restaurée',
  'Chain': 'Chaîne',
  'Segment': 'Segment',
  '{name} (copy)': '{name} (copie)',
  'Next: {name}': 'Suivant : {name}',
  '{i} of {n}': '{i} sur {n}',
  '{name} complete': '{name} terminée',
  'Notifications enabled': 'Notifications activées',
  'Notifications were blocked': 'Les notifications ont été bloquées',
  'Permission granted': 'Autorisation accordée',
  'Permission denied': 'Autorisation refusée',
  'Opening system settings — toggle "Allow exact alarms" ON, then come back.':
    'Ouverture des réglages système — activez « Autoriser les alarmes exactes », puis revenez.',
  'Opening battery settings — choose Unrestricted (or Allow), then come back.':
    'Ouverture des réglages de batterie — choisissez « Non restreinte » (ou Autoriser), puis revenez.',
  'Chains exported': 'Chaînes exportées',
  'Chains imported': 'Chaînes importées',
  'Import failed': 'Échec de l’import',
  'Chain saved': 'Chaîne enregistrée',
  'Save first to use this menu': 'Enregistrez d’abord pour utiliser ce menu',
  'Stop this chain to use the more menu': 'Arrêtez cette chaîne pour utiliser ce menu',
  'Duplicated': 'Dupliquée',
  'Chain exported': 'Chaîne exportée',
  'Rename unavailable for this run': 'Renommage indisponible pour cette exécution',
  'Installed': 'Installée',
  'A chain needs at least one segment': 'Une chaîne doit avoir au moins un segment',
  'Pre-start countdown': 'Compte à rebours de départ',
  'Skip': 'Passer',
  'Always skip': 'Toujours passer',
  'Language updated': 'Langue modifiée',

  // ---- Templates view ----------------------------------------------------
  'Back': 'Retour',
  'Catalogue': 'Catalogue',
  'Hand-tuned starter chains. Tap to fork into your chains.':
    'Des chaînes prêtes à l’emploi. Touchez-en une pour la copier dans vos chaînes.',
  '× {n} loops': '× {n} boucles',

  // ---- Editor ------------------------------------------------------------
  'Editing': 'Modification',
  'New': 'Nouvelle',
  'Running': 'En cours',
  'More': 'Plus',
  'This chain is running.': 'Cette chaîne est en cours.',
  'Editing is disabled until it stops.': 'La modification est désactivée jusqu’à son arrêt.',
  'Stop chain': 'Arrêter la chaîne',
  'Chain name': 'Nom de la chaîne',
  'Chain cue overrides': 'Signaux propres à la chaîne',
  'Total': 'Total',
  'Segments': 'Segments',
  'Loops': 'Boucles',
  'Fewer loops': 'Moins de boucles',
  'More loops': 'Plus de boucles',
  'Add segment': 'Ajouter un segment',
  'Embed chain': 'Intégrer une chaîne',
  'Tip: drag the handle to reorder segments. Tap the color dot to change hue, or the bell to override cues.':
    'Astuce : faites glisser la poignée pour réordonner les segments. Touchez la pastille pour changer de couleur, ou la cloche pour personnaliser les signaux.',
  'Start here: tap the highlighted duration to set how long this segment runs.':
    'Commencez ici : touchez la durée en surbrillance pour régler la longueur de ce segment.',
  'Save': 'Enregistrer',
  'Save & start': 'Enregistrer et lancer',
  'Color {c}': 'Couleur {c}',
  'amber': 'ambre', 'rust': 'rouille', 'rose': 'rose', 'violet': 'violet',
  'indigo': 'indigo', 'teal': 'bleu canard', 'sage': 'sauge', 'bone': 'ivoire',
  '(missing)': '(introuvable)',
  '№ {n} · embedded chain': '№ {n} · chaîne intégrée',
  'Not found': 'Introuvable',
  'Name': 'Nom',
  'Cycle color': 'Changer de couleur',
  'Segment cue overrides': 'Signaux propres au segment',
  'Cue overrides': 'Signaux personnalisés',
  'Remove segment': 'Supprimer le segment',
  'No other chains yet. Save this one and create another to embed.':
    'Aucune autre chaîne pour l’instant. Enregistrez celle-ci et créez-en une autre à intégrer.',

  // ---- Duration sheet ----------------------------------------------------
  'Set duration': 'Régler la durée',
  'Duration': 'Durée',
  'Segment {n}': 'Segment {n}',
  'Segment name (optional)': 'Nom du segment (facultatif)',
  'Add to current duration': 'Ajouter à la durée',
  'Digit keypad': 'Pavé numérique',
  'Backspace': 'Effacer',

  // ---- Run view ----------------------------------------------------------
  'Back to library (keep running)': 'Retour à la liste (la chaîne continue)',
  'Stop': 'Arrêter',
  'Rename chain': 'Renommer la chaîne',
  'Chain cues': 'Signaux de la chaîne',
  'Rename segment': 'Renommer le segment',
  'Segment name': 'Nom du segment',
  'of {n}': 'sur {n}',
  '{t} elapsed': '{t} écoulé',
  '{t} remaining': '{t} restant',
  'Next': 'Suivant',
  'Time\'s up': 'Temps écoulé',
  'Dismiss': 'Arrêter',
  'Continue': 'Continuer',
  '{name} done': '{name} terminé',
  'Previous segment': 'Segment précédent',
  'Pause': 'Pause',
  'Resume': 'Reprendre',
  'Next segment': 'Segment suivant',
  'Get ready': 'Préparez-vous',
  'Chain complete.': 'Chaîne terminée.',
  'Well done.': 'Bien joué.',
  'total time': 'durée totale',
  'segments': 'segments',
  'Run again': 'Relancer',
  'Done': 'Terminé',

  // ---- Settings ----------------------------------------------------------
  'Close': 'Fermer',
  'Default cues': 'Signaux par défaut',
  'These set the baseline for every chain. You can override them per chain (bell icon in the editor) or per segment (bell icon on each row).':
    'Ils s’appliquent à toutes les chaînes. Vous pouvez les modifier par chaîne (cloche dans l’éditeur) ou par segment (cloche sur chaque ligne).',
  'Sound cues': 'Signaux sonores',
  'Chime when a segment ends and at chain start/end.': 'Carillon à la fin de chaque segment, au début et à la fin de la chaîne.',
  'Final 3 seconds tick': 'Bips des 3 dernières secondes',
  'Three quick tones counting down the last 3s of each segment.': 'Trois bips brefs pour décompter les 3 dernières secondes de chaque segment.',
  'Ring until dismissed': 'Sonner jusqu’à l’arrêt',
  'When a chain finishes, keep ringing until you tap Dismiss.': 'À la fin d’une chaîne, sonner jusqu’à ce que vous touchiez Arrêter.',
  'Voice cues': 'Annonces vocales',
  'Speak each segment name aloud as it begins.': 'Annoncer à voix haute le nom de chaque segment quand il commence.',
  'Buzz cues': 'Vibrations',
  'Buzz the phone at every segment boundary and at chain end.': 'Faire vibrer le téléphone à chaque changement de segment et à la fin de la chaîne.',
  '3-2-1 before the chain starts.': '3-2-1 avant le début de la chaîne.',
  'Other': 'Autres',
  'Language': 'Langue',
  'Language of the app. Auto follows your device.': 'Langue de l’appli. Auto suit celle de votre appareil.',
  'Auto': 'Auto',
  'When a headset is connected': 'Quand un casque est connecté',
  'Where the chain plays its audio cues. Only affects the chain; system sounds are unchanged.':
    'Où la chaîne joue ses signaux sonores. Ne concerne que la chaîne ; les sons du système ne changent pas.',
  'Audio routing': 'Sortie audio',
  'Headset only': 'Casque seul',
  'Both': 'Les deux',
  'Speaker only': 'Haut-parleur seul',
  'Ring through Do Not Disturb': 'Sonner malgré « Ne pas déranger »',
  'Off (default) — cues follow your media / music volume slider and are silenced when your phone is in silent mode or DND. On — cues follow the alarm volume slider and ring through DND, like an alarm clock.':
    'Désactivé (par défaut) — les signaux suivent le volume multimédia et se taisent en mode silencieux ou « Ne pas déranger ». Activé — ils suivent le volume des alarmes et sonnent malgré « Ne pas déranger », comme un réveil.',
  'Keep screen awake': 'Garder l’écran allumé',
  'Wake Lock — prevents your screen from sleeping during a run.': 'Empêche l’écran de se mettre en veille pendant une chaîne.',
  'Notifications': 'Notifications',
  'Show a system notification at each transition.': 'Afficher une notification système à chaque transition.',
  'Enable': 'Activer',
  'Enabled': 'Activées',
  'Blocked': 'Bloquées',
  'System notifications enabled.': 'Notifications système activées.',
  'Notifications blocked in browser settings.': 'Notifications bloquées dans les réglages du navigateur.',
  'Native bridge': 'Pont natif',
  'Native bridge — {p}': 'Pont natif — {p}',
  'Active': 'Actif',
  'Notifications blocked': 'Notifications bloquées',
  'Exact alarms denied': 'Alarmes exactes refusées',
  'Background restricted': 'Arrière-plan restreint',
  'Test in 10s': 'Tester dans 10 s',
  'Test in 30s': 'Tester dans 30 s',
  'Re-request permission': 'Redemander l’autorisation',
  'Fix exact alarms': 'Corriger les alarmes exactes',
  'Allow background': 'Autoriser l’arrière-plan',
  'Tip:': 'Astuce :',
  'after tapping a test, lock the screen. The notification should fire on time. If it doesn\'t, check that this app is excluded from your phone\'s':
    'après avoir lancé un test, verrouillez l’écran. La notification doit arriver à l’heure. Sinon, vérifiez que l’appli est exclue de',
  'battery optimization': 'l’optimisation de la batterie',
  'Export all': 'Tout exporter',
  'Import…': 'Importer…',
  'Version {v}': 'Version {v}',
  'Update available': 'Mise à jour disponible',
  '↑ {v} available': '↑ {v} disponible',
  'newer': 'plus récente',
  'Built with care. Open source on': 'Fait avec soin. Code source ouvert sur',

  // ---- Cue sheet ---------------------------------------------------------
  'Cues': 'Signaux',
  'Override the defaults inherited from app settings.': 'Modifier les réglages hérités de l’appli.',
  'Three quick tones counting down the last 3s.': 'Trois bips brefs pour décompter les 3 dernières secondes.',
  'Keep ringing when the chain finishes, until you tap Dismiss.': 'À la fin de la chaîne, sonner jusqu’à ce que vous touchiez Arrêter.',
  'Buzz at every segment boundary and at chain end.': 'Vibrer à chaque changement de segment et à la fin de la chaîne.',
  'Sound cue': 'Signal sonore',
  'Chime when this segment ends.': 'Carillon à la fin de ce segment.',
  'Three quick tones counting down this segment\'s last 3s.': 'Trois bips brefs pour décompter les 3 dernières secondes de ce segment.',
  'Keep ringing at the end of this segment; the chain waits here until you tap Continue.':
    'Sonner à la fin de ce segment ; la chaîne attend ici jusqu’à ce que vous touchiez Continuer.',
  'Voice cue': 'Annonce vocale',
  'Speak this segment\'s name aloud as it begins.': 'Annoncer à voix haute le nom de ce segment quand il commence.',
  'Buzz cue': 'Vibration',
  'Vibrate when this segment ends.': 'Vibrer à la fin de ce segment.',
  'Segment cues': 'Signaux du segment',
  'Override the app defaults for this chain. Per-segment overrides win over these.':
    'Modifier les réglages de l’appli pour cette chaîne. Les réglages de chaque segment priment sur ceux-ci.',
  'Override the chain defaults for this segment.': 'Modifier les réglages de la chaîne pour ce segment.',
  'Default': 'Défaut',
  'On': 'Oui',
  'Off': 'Non',

  // ---- Sheets --------------------------------------------------------------
  'Embed a chain': 'Intégrer une chaîne',
  'Pick a chain to nest inside this one. Edits to the embedded chain will update everywhere it\'s used.':
    'Choisissez une chaîne à imbriquer dans celle-ci. Toute modification de la chaîne intégrée s’appliquera partout où elle est utilisée.',
  'Chain actions': 'Actions de la chaîne',
  'Duplicate': 'Dupliquer',
  'Make an editable copy of this chain.': 'Créer une copie modifiable de cette chaîne.',
  'Export JSON': 'Exporter en JSON',
  'Download this chain as a file you can share or import elsewhere.': 'Télécharger cette chaîne dans un fichier à partager ou importer ailleurs.',
  'Delete chain': 'Supprimer la chaîne',
  'This cannot be undone.': 'Cette action est irréversible.',
  'Enjoying Chained Timers?': 'Chained Timers vous plaît ?',
  'However it is going, we would like to hear it.': 'Quel que soit votre avis, nous aimerions le connaître.',
  'Not really': 'Pas vraiment',
  'Yes': 'Oui',

  // ---- Install / update ----------------------------------------------------
  'Install on home screen.': 'Installer sur l’écran d’accueil.',
  'Notifications & vibration work better as an app.': 'Notifications et vibrations fonctionnent mieux dans l’appli.',
  'Install': 'Installer',
  'A newer version is available. Update to get the latest fixes and features.':
    'Une nouvelle version est disponible. Mettez à jour pour profiter des derniers correctifs et nouveautés.',
  'Not now': 'Plus tard',
  'Update': 'Mettre à jour',
  'newer version': 'nouvelle version',
  'Downloads and installs the update in-app via the Play Store.': 'Télécharge et installe la mise à jour depuis le Play Store, sans quitter l’appli.',
  'Opens the App Store listing.': 'Ouvre la fiche de l’App Store.',
  'Opens the GitHub Releases page — download the new APK and install it over the current one (your chains are preserved).':
    'Ouvre la page des versions sur GitHub — téléchargez le nouvel APK et installez-le par-dessus l’actuel (vos chaînes sont conservées).',

  // ---- Native bridge (js/native.js) ---------------------------------------
  'Notifications denied — background alerts disabled': 'Notifications refusées — alertes en arrière-plan désactivées',
  'app notifications OFF': 'notifications de l’appli DÉSACTIVÉES',
  '"Chain transitions" channel OFF': 'canal « Transitions de chaîne » DÉSACTIVÉ',
  '"Chain complete" channel OFF': 'canal « Chaîne terminée » DÉSACTIVÉ',
  '⚠ Critical: {parts} — open OS Settings → Apps → Chained Timers → Notifications and re-enable.':
    '⚠ Critique : {parts} — ouvrez Réglages → Applis → Chained Timers → Notifications et réactivez-les.',
  '⚠ Reliability: this phone may kill the timer when the screen is locked. Tap Settings → Native bridge → Allow background to fix.':
    '⚠ Fiabilité : ce téléphone peut couper le minuteur écran verrouillé. Corrigez-le dans Réglages → Pont natif → Autoriser l’arrière-plan.',
  'Exact-alarm permission denied — notifications may be late. Tap Settings to fix.':
    'Alarmes exactes refusées — les notifications peuvent être en retard. Corrigez-le dans les Réglages.',
  'Background scheduling failed: {msg}': 'Échec de la programmation en arrière-plan : {msg}',
  'Notifications denied — grant in OS settings': 'Notifications refusées — autorisez-les dans les réglages du système',
  'Test notification scheduled for {n}s. Lock the screen.': 'Notification de test prévue dans {n} s. Verrouillez l’écran.',
  'Test failed: {msg}': 'Échec du test : {msg}',
  'Chained Timers test': 'Test Chained Timers',
  'If you can see this, background notifications are working. Scheduled {n}s ago.':
    'Si vous voyez ceci, les notifications en arrière-plan fonctionnent. Programmée il y a {n} s.',
  'Last segment': 'Dernier segment',
  'Up next: {name} ({dur})': 'Ensuite : {name} ({dur})',
  '{name} · {n} segments done': '{name} · {n} segments terminés',
  '{name} complete\n{n} segments done': '{name} terminée\n{n} segments terminés',
  '1 segment done': '1 segment terminé',
  '{n} segments done': '{n} segments terminés',
  '{name} complete · tap Dismiss': '{name} terminée · touchez Arrêter',
  '{name} done · tap Continue': '{name} terminé · touchez Continuer',
  '{n} chains running': '{n} chaînes en cours',
};

// Template chains — kept apart from the UI table on purpose (see header).
const TEMPLATES_FR = {
  'Plank Stack': 'Série de gainage',
  '90s front plank, 60s each side, repeated, finished by a 90s hold.':
    '90 s de planche, 60 s de chaque côté, deux fois, puis un maintien final de 90 s.',
  'Front plank': 'Planche',
  'Side plank — L': 'Planche latérale — G',
  'Side plank — R': 'Planche latérale — D',
  'Final hold': 'Maintien final',
  'Tabata': 'Tabata',
  'Eight 20s sprints, 10s rest. The classic 4-minute conditioning protocol.':
    'Huit sprints de 20 s, 10 s de repos. Le protocole classique de 4 minutes.',
  'Work': 'Effort',
  'Rest': 'Repos',
  'EMOM 10': 'EMOM 10',
  'Every Minute on the Minute — ten rounds of one minute. Do your reps, then rest.':
    'Chaque minute, à la minute — dix tours d’une minute. Faites vos répétitions, puis récupérez.',
  'Round': 'Tour',
  'Boxing Rounds': 'Rounds de boxe',
  'Three 3-minute rounds, one minute between. Tune up your jab.':
    'Trois rounds de 3 minutes, une minute entre chaque. Affûtez votre jab.',
  'Round 1': 'Round 1',
  'Round 2': 'Round 2',
  'Round 3': 'Round 3',
  'Pomodoro': 'Pomodoro',
  '25 minutes of focused work, then a 5-minute break. Repeat as needed.':
    '25 minutes de travail concentré, puis 5 minutes de pause. À répéter selon vos besoins.',
  'Focus': 'Concentration',
  'Break': 'Pause',
  'Box Breath': 'Respiration carrée',
  'Four-by-four-by-four. Inhale, hold, exhale, hold. Twelve rounds.':
    'Quatre temps de quatre secondes : inspirez, retenez, expirez, retenez. Douze cycles.',
  'Inhale': 'Inspirez',
  'Hold': 'Retenez',
  'Exhale': 'Expirez',
};

const DICTS     = { fr: FR };
const TPL_DICTS = { fr: TEMPLATES_FR };
const SUPPORTED = ['en', 'fr'];
const TTS_TAGS  = { en: 'en-US', fr: 'fr-FR' };

function interpolate(s, params) {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

const I18n = {
  setting: 'auto',   // 'auto' | 'en' | 'fr'
  lang: 'en',        // resolved language actually shown

  /** Device / browser language, reduced to one we support. */
  detect() {
    try {
      const tags = [].concat(navigator.languages || [], navigator.language || []);
      for (const tag of tags) {
        const base = String(tag || '').toLowerCase().split(/[-_]/)[0];
        if (SUPPORTED.includes(base)) return base;
      }
    } catch {}
    return 'en';
  },

  /** Resolve and apply a setting ('auto' | 'en' | 'fr'). */
  init(setting) {
    this.setting = SUPPORTED.includes(setting) ? setting : 'auto';
    this.lang = this.setting === 'auto' ? this.detect() : this.setting;
    try { document.documentElement.lang = this.lang; } catch {}
    return this.lang;
  },

  t(s, params) {
    if (s == null) return '';
    const str = String(s);
    const dict = DICTS[this.lang];
    let out = (dict && Object.prototype.hasOwnProperty.call(dict, str)) ? dict[str] : str;
    // A plural entry: { one, other }, chosen by params.n.
    if (out && typeof out === 'object') {
      out = this._isSingular(Number(params && params.n)) ? out.one : out.other;
    }
    return interpolate(out, params);
  },

  /** Whether the current language has an entry for this English text. */
  has(s) {
    const dict = DICTS[this.lang];
    return !!dict && Object.prototype.hasOwnProperty.call(dict, String(s));
  },

  /** French (like most Romance languages) treats 0 and 1 as singular. */
  _isSingular(n) {
    return this.lang === 'fr' ? Math.abs(n) < 2 : n === 1;
  },

  plural(n, one, other, params) {
    return this.t(this._isSingular(n) ? one : other, Object.assign({ n }, params || {}));
  },

  /** Template chain wording (names, descriptions, segment names). */
  tpl(s) {
    const dict = TPL_DICTS[this.lang];
    return (dict && Object.prototype.hasOwnProperty.call(dict, s)) ? dict[s] : s;
  },

  /**
   * BCP-47 tag for speech, or null to let the platform follow the
   * device. Only an EXPLICIT language choice pins the voice: with
   * 'auto' the device's own TTS locale (native) / browser language
   * (web) is the better guess, region included.
   */
  ttsLang() {
    return this.setting === 'auto' ? null : (TTS_TAGS[this.lang] || null);
  },

  // ---- static markup ------------------------------------------------------
  // index.html is written in English. Every text node and translatable
  // attribute whose trimmed content is a dictionary key is translated in
  // place; the English source is remembered so a later language switch
  // can re-translate it. Nodes that app code has since rewritten (their
  // text no longer matches what we put there) are left alone — the code
  // that rewrote them translates its own output.
  _textNodes: [],
  _attrNodes: [],
  _collected: false,
  ATTRS: ['placeholder', 'aria-label', 'title'],

  _collect(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || /^(SCRIPT|STYLE|TEMPLATE)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    let n;
    while ((n = walker.nextNode())) {
      const raw = n.nodeValue;
      const src = raw.trim();
      if (!Object.prototype.hasOwnProperty.call(FR, src)) continue;
      const lead = raw.slice(0, raw.indexOf(src));
      const tail = raw.slice(raw.indexOf(src) + src.length);
      this._textNodes.push({ node: n, src, lead, tail, applied: raw });
    }
    root.querySelectorAll('*').forEach(el => {
      for (const a of this.ATTRS) {
        const v = el.getAttribute(a);
        if (v && Object.prototype.hasOwnProperty.call(FR, v.trim())) {
          this._attrNodes.push({ el, attr: a, src: v.trim(), applied: v });
        }
      }
    });
    this._collected = true;
  },

  applyStatic(root) {
    if (!this._collected) this._collect(root || document.body);
    for (const e of this._textNodes) {
      if (!e.node.isConnected || e.node.nodeValue !== e.applied) continue;
      const next = e.lead + this.t(e.src) + e.tail;
      e.node.nodeValue = next;
      e.applied = next;
    }
    for (const e of this._attrNodes) {
      if (!e.el.isConnected || e.el.getAttribute(e.attr) !== e.applied) continue;
      const next = this.t(e.src);
      e.el.setAttribute(e.attr, next);
      e.applied = next;
    }
  },
};

window.I18n = I18n;
window.T  = (s, params) => I18n.t(s, params);
window.Tn = (n, one, other, params) => I18n.plural(n, one, other, params);
})();
