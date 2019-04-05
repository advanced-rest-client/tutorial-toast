/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {mixinBehaviors} from '../../@polymer/polymer/lib/legacy/class.js';
import {IronA11yAnnouncer} from '../../@polymer/iron-a11y-announcer/iron-a11y-announcer.js';
import {IronOverlayBehaviorImpl, IronOverlayBehavior} from
  '../../@polymer/iron-overlay-behavior/iron-overlay-behavior.js';
import '../../@polymer/paper-button/paper-button.js';
import '../../@polymer/iron-flex-layout/iron-flex-layout.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
// Keeps track of the toast currently opened.
let currentToast = null;

/**
 * An on screen minimal tutorial.
 *
 * ### Example
 *
 * ```html
 * <tutorial-toast>
 *  <p>This is a tutorial for the page. Take a hint.</p>
 * </tutorial-toast>
 * ```
 *
 * ### Styling
 *
 * `<tutorial-toast>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--tutorial-toast` | Mixin applied to the element | `{}`
 * `--tutorial-toast-background-color` | The tutorial-toast background-color | `#323232`
 * `--tutorial-toast-color` | The tutorial-toast color | `#f1f1f1`
 * `--tutorial-toast-min-width` | Min width of the tutorial toast | `60%`
 * `--tutorial-toast-left` | Left position for the tutorial toast | `20%`
 * `--tutorial-toast-button` | Mixin applied to the close tutorial button | `{}`
 * `--tutorial-toast-button-color` | Color of the action button to close the tutorial toast | ``
 * `--tutorial-toast-button-background-color` | Background color of action button | ``
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin Polymer.IronOverlayBehavior
 */
class TutorialToast extends mixinBehaviors([IronOverlayBehavior], PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      position: fixed;
      background-color: var(--tutorial-toast-background-color, #323232);
      color: var(--tutorial-toast-color, #f1f1f1);
      min-height: 48px;
      min-width: var(--tutorial-toast-min-width, 60%);
      left: var(--tutorial-toast-left, 20%);
      bottom: 0;
      padding: 8px 4px;
      box-sizing: border-box;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
      border-radius: 2px;
      margin: 0px;
      font-size: 16px;
      font-weight: 400;
      cursor: default;
      -webkit-transition: -webkit-transform 0.3s, opacity 0.3s;
      transition: transform 0.3s, opacity 0.3s;
      opacity: 0;
      -webkit-transform: translateY(100px);
      transform: translateY(100px);

      @apply --arc-font-common-base;
      @apply --tutorial-toast;
    }

    .container {
      @apply --layout-horizontal;
    }

    .content {
      @apply --layout-flex;
      @apply --layout-horizontal;
      @apply --layout-center-center;
    }

    :host(.fit-bottom) {
      width: 100%;
      min-width: 0;
      border-radius: 0;
      margin: 0;
    }

    :host(.tutorial-toast-open) {
      opacity: 1;
      -webkit-transform: translateY(0px);
      transform: translateY(0px);
    }

    .main-button {
      background-color: var(--tutorial-toast-button-background-color);
      color: var(--tutorial-toast-button-color);
      @apply --tutorial-toast-button;
    }
    </style>
    <div class="container">
      <div class="content">
        <slot></slot>
      </div>
      <paper-button class="main-button" on-tap="close">Close</paper-button>
    </div>
`;
  }

  static get is() {
    return 'tutorial-toast';
  }
  static get properties() {
    return {
      /**
       * The element to fit `this` into.
       * Overridden from `Polymer.IronFitBehavior`.
       */
      fitInto: {
        type: Object,
        value: window,
        observer: '_onFitIntoChanged'
      },
      /**
       * The duration in milliseconds to show the toast.
       * Set to `0`, a negative number, or `Infinity`, to disable the
       * toast auto-closing.
       */
      duration: {
        type: Number,
        value: 0
      },
      /**
       * Overridden from `IronOverlayBehavior`.
       * Set to false to enable closing of the toast by clicking outside it.
       */
      noCancelOnOutsideClick: {
        type: Boolean,
        value: true
      },
      /**
       * Overridden from `IronOverlayBehavior`.
       * Set to true to disable auto-focusing the toast or child nodes with
       * the `autofocus` attribute` when the overlay is opened.
       */
      noAutoFocus: {
        type: Boolean,
        value: true
      }
    };
  }

  constructor() {
    super();
    this.__onTransitionEnd = this.__onTransitionEnd.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._autoClose = null;
    IronA11yAnnouncer.requestAvailability();
    this.addEventListener('transitionend', this.__onTransitionEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('transitionend', this.__onTransitionEnd);
  }
  /**
   * Read-only. Can auto-close if duration is a positive finite number.
   */
  get _canAutoClose() {
    return this.duration > 0 && this.duration !== Infinity;
  }
  /**
   * Called on transitions of the toast, indicating a finished animation
   * @param {Event} e
   */
  __onTransitionEnd(e) {
    // there are different transitions that are happening when opening and
    // closing the toast. The last one so far is for `opacity`.
    // This marks the end of the transition, so we check for this to determine if this
    // is the correct event.
    if (e && e.target === this && e.propertyName === 'opacity') {
      if (this.opened) {
        this._finishRenderOpened();
      } else {
        this._finishRenderClosed();
      }
    }
  }

  /**
   * Overridden from `IronOverlayBehavior`.
   * Called when the value of `opened` changes.
   */
  _openedChanged() {
    if (this._autoClose !== null) {
      this.cancelAsync(this._autoClose);
      this._autoClose = null;
    }
    if (this.opened) {
      if (currentToast && currentToast !== this) {
        currentToast.close();
      }
      currentToast = this;
      if (this._canAutoClose) {
        this._autoClose = this.async(this.close, this.duration);
      }
    } else if (currentToast === this) {
      currentToast = null;
    }
    IronOverlayBehaviorImpl._openedChanged.apply(this, arguments);
  }

  /**
   * Overridden from `IronOverlayBehavior`.
   */
  _renderOpened() {
    this.classList.add('tutorial-toast-open');
  }

  /**
   * Overridden from `IronOverlayBehavior`.
   */
  _renderClosed() {
    this.classList.remove('tutorial-toast-open');
  }

  _onFitIntoChanged(fitInto) {
    this.positionTarget = fitInto;
  }
}
window.customElements.define(TutorialToast.is, TutorialToast);
