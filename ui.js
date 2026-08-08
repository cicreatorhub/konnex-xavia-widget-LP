/**
 * ============================================================
 * Xavia Widget UI
 * ============================================================
 *
 * Responsible ONLY for rendering and controlling the interface.
 * No backend/API calls belong here.
 *
 * Features:
 * - Responsive desktop/mobile layout
 * - Proper chat header
 * - Close button
 * - Scrollable conversation area
 * - Fixed input area
 * - Proper "Powered by Konnex AI" footer
 * - Typing indicator
 * - Send button state
 * - Mobile keyboard friendly input
 * - Safe message rendering
 *
 * ============================================================
 */

import { formatTime } from "./utils.js";

export class XaviaUI {

    constructor(config) {

        this.config = config;

        this.elements = {};

    }

    /**
     * ========================================================
     * BUILD WIDGET
     * ========================================================
     */

    build() {

        /*
         * Prevent duplicate widgets if the loader is
         * accidentally included more than once.
         */

        const existing =
            document.getElementById("xavia-widget");

        if (existing) {

            existing.remove();

        }

        /*
         * Main widget container
         */

        const root =
            document.createElement("div");

        root.id = "xavia-widget";

        root.innerHTML = `

            <!-- ==================================================
                 Floating Launcher
                 ================================================== -->

            <button
                id="xavia-launcher"
                type="button"
                aria-label="Open Xavia chat"
                title="Chat with Xavia"
            >
                <span aria-hidden="true">💬</span>
            </button>


            <!-- ==================================================
                 Chat Window
                 ================================================== -->

            <section
                id="xavia-chat"
                aria-label="Xavia customer assistant"
                aria-hidden="true"
            >


                <!-- ==============================================
                     Header
                     ============================================== -->

                <div id="xavia-header">

                    <div
                        id="xavia-avatar"
                        aria-hidden="true"
                    >
                        ${this.escapeHTML(
                            this.config.avatar || "X"
                        )}
                    </div>


                    <div
                        id="xavia-business-info"
                    >

                        <div id="xavia-business">

                            ${this.escapeHTML(
                                this.config.businessName ||
                                "Xavia AI"
                            )}

                        </div>


                        <div id="xavia-status">

                            <span
                                id="xavia-status-dot"
                                aria-hidden="true"
                            >
                                ●
                            </span>

                            Xavia is online

                        </div>

                    </div>


                    <!-- Close Button -->

                    <button
                        id="xavia-close"
                        type="button"
                        aria-label="Close chat"
                        title="Close chat"
                    >
                        <span aria-hidden="true">×</span>
                    </button>

                </div>


                <!-- ==============================================
                     Messages
                     ============================================== -->

                <div
                    id="xavia-messages"
                    role="log"
                    aria-live="polite"
                    aria-label="Conversation"
                >
                </div>


                <!-- ==============================================
                     Input Area
                     ============================================== -->

                <div id="xavia-input-area">


                    <textarea
                        id="xavia-input"
                        rows="1"
                        maxlength="2000"
                        placeholder="Type your message..."
                        aria-label="Type your message"
                    ></textarea>


                    <button
                        id="xavia-send"
                        type="button"
                        aria-label="Send message"
                        title="Send message"
                    >

                        <span
                            id="xavia-send-icon"
                            aria-hidden="true"
                        >
                            ➤
                        </span>

                    </button>

                </div>


                <!-- ==============================================
                     Powered By Footer
                     ============================================== -->

                <div id="xavia-powered-by">

                    <span>
                        Powered by
                        <strong>Konnex AI</strong>
                    </span>

                </div>


            </section>
        `;


        /*
         * Add widget to page
         */

        document.body.appendChild(root);


        /*
         * Cache DOM elements
         */

        this.elements = {

            root,

            launcher:
                root.querySelector(
                    "#xavia-launcher"
                ),

            chat:
                root.querySelector(
                    "#xavia-chat"
                ),

            close:
                root.querySelector(
                    "#xavia-close"
                ),

            messages:
                root.querySelector(
                    "#xavia-messages"
                ),

            input:
                root.querySelector(
                    "#xavia-input"
                ),

            send:
                root.querySelector(
                    "#xavia-send"
                ),

            sendIcon:
                root.querySelector(
                    "#xavia-send-icon"
                ),

            business:
                root.querySelector(
                    "#xavia-business"
                ),

            avatar:
                root.querySelector(
                    "#xavia-avatar"
                ),

            status:
                root.querySelector(
                    "#xavia-status"
                )

        };


        /*
         * Initial state
         */

        this.elements.chat.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
         * Auto resize input when first created
         */

        this.resizeInput();

    }


    /**
     * ========================================================
     * TOGGLE CHAT
     * ========================================================
     */

    toggle() {

        if (
            !this.elements.chat ||
            !this.elements.launcher
        ) {

            return;

        }

        const isOpen =
            this.elements.chat.classList.contains(
                "open"
            );


        if (isOpen) {

            this.close();

        } else {

            this.open();

        }

    }


    /**
     * ========================================================
     * OPEN CHAT
     * ========================================================
     */

    open() {

        this.elements.chat.classList.add(
            "open"
        );

        this.elements.chat.setAttribute(
            "aria-hidden",
            "false"
        );

        this.elements.launcher.setAttribute(
            "aria-label",
            "Close Xavia chat"
        );


        /*
         * Focus input after opening.
         *
         * Small delay allows the opening animation
         * to complete properly on mobile browsers.
         */

        setTimeout(() => {

            if (this.elements.input) {

                this.elements.input.focus();

            }

        }, 250);


        this.scrollBottom();

    }


    /**
     * ========================================================
     * CLOSE CHAT
     * ========================================================
     */

    close() {

        this.elements.chat.classList.remove(
            "open"
        );

        this.elements.chat.setAttribute(
            "aria-hidden",
            "true"
        );

        this.elements.launcher.setAttribute(
            "aria-label",
            "Open Xavia chat"
        );

    }


    /**
     * ========================================================
     * UPDATE BUSINESS INFORMATION
     * ========================================================
     */

    setBusiness(data = {}) {

        if (!this.elements.business) {

            return;

        }


        this.elements.business.textContent =
            data.businessName ||
            data.name ||
            this.config.businessName ||
            "Xavia AI";


        this.elements.avatar.textContent =
            data.avatar ||
            this.config.avatar ||
            "X";


        /*
         * Update browser accessibility information.
         */

        this.elements.chat.setAttribute(
            "aria-label",
            `${data.businessName || data.name || "Business"} customer assistant`
        );

    }


    /**
     * ========================================================
     * CHECK WHETHER MESSAGES EXIST
     * ========================================================
     */

    hasMessages() {

        if (!this.elements.messages) {

            return false;

        }

        return (
            this.elements.messages.children.length > 0
        );

    }


    /**
     * ========================================================
     * ADD MESSAGE
     * ========================================================
     */

    addMessage(role, text) {

        if (!this.elements.messages) {

            return;

        }


        /*
         * Remove typing indicator before adding
         * an actual bot response.
         */

        if (role === "bot") {

            this.hideTyping();

        }


        const wrapper =
            document.createElement("div");


        wrapper.className =
            `xavia-message ${role}`;


        /*
         * Message bubble
         */

        const bubble =
            document.createElement("div");


        bubble.className =
            "bubble";


        /*
         * IMPORTANT:
         *
         * Use textContent rather than innerHTML.
         *
         * This prevents a customer message containing
         * HTML/JavaScript from being injected into
         * the page.
         */

        bubble.textContent =
            text == null
                ? ""
                : String(text);


        /*
         * Timestamp
         */

        const time =
            document.createElement("div");


        time.className =
            "time";


        time.textContent =
            formatTime();


        /*
         * Assemble message
         */

        wrapper.appendChild(
            bubble
        );

        wrapper.appendChild(
            time
        );


        this.elements.messages.appendChild(
            wrapper
        );


        /*
         * Scroll to latest message
         */

        this.scrollBottom();

    }


    /**
     * ========================================================
     * TYPING INDICATOR
     * ========================================================
     */

    showTyping() {

        /*
         * Prevent duplicates
         */

        if (
            document.getElementById(
                "xavia-typing"
            )
        ) {

            return;

        }


        const typing =
            document.createElement("div");


        typing.className =
            "xavia-message bot";


        typing.id =
            "xavia-typing";


        typing.innerHTML = `

            <div class="bubble">

                <div class="typing">

                    <span></span>
                    <span></span>
                    <span></span>

                </div>

            </div>

        `;


        this.elements.messages.appendChild(
            typing
        );


        this.scrollBottom();

    }


    /**
     * ========================================================
     * HIDE TYPING INDICATOR
     * ========================================================
     */

    hideTyping() {

        const typing =
            document.getElementById(
                "xavia-typing"
            );


        if (typing) {

            typing.remove();

        }

    }


    /**
     * ========================================================
     * SHOW ERROR
     * ========================================================
     */

    showError(message) {

        this.hideTyping();


        this.addMessage(

            "bot",

            `⚠️ ${message}`

        );

    }


    /**
     * ========================================================
     * CLEAR INPUT
     * ========================================================
     */

    clearInput() {

        if (!this.elements.input) {

            return;

        }


        this.elements.input.value = "";


        this.resizeInput();

    }


    /**
     * ========================================================
     * RESIZE TEXTAREA
     * ========================================================
     *
     * Allows the input box to grow when the customer
     * writes a longer message.
     */

    resizeInput() {

        const input =
            this.elements.input;


        if (!input) {

            return;

        }


        /*
         * Reset height first so scrollHeight can
         * calculate the correct value.
         */

        input.style.height =
            "auto";


        const maxHeight =
            120;


        const newHeight =
            Math.min(
                input.scrollHeight,
                maxHeight
            );


        input.style.height =
            `${newHeight}px`;

    }


    /**
     * ========================================================
     * SET SENDING STATE
     * ========================================================
     */

    setSending(isSending) {

        if (
            !this.elements.send ||
            !this.elements.input
        ) {

            return;

        }


        this.elements.send.disabled =
            isSending;


        /*
         * Prevent typing another message while
         * the current request is processing.
         */

        if (isSending) {

            this.elements.send.classList.add(
                "sending"
            );

            this.elements.send.setAttribute(
                "aria-label",
                "Sending message"
            );


            if (this.elements.sendIcon) {

                this.elements.sendIcon.textContent =
                    "…";

            }

        } else {

            this.elements.send.classList.remove(
                "sending"
            );

            this.elements.send.setAttribute(
                "aria-label",
                "Send message"
            );


            if (this.elements.sendIcon) {

                this.elements.sendIcon.textContent =
                    "➤";

            }

        }

    }


    /**
     * ========================================================
     * SCROLL TO BOTTOM
     * ========================================================
     */

    scrollBottom() {

        if (!this.elements.messages) {

            return;

        }


        /*
         * Use requestAnimationFrame so the browser
         * finishes rendering the new message first.
         */

        requestAnimationFrame(() => {

            this.elements.messages.scrollTop =
                this.elements.messages.scrollHeight;

        });

    }


    /**
     * ========================================================
     * ESCAPE HTML
     * ========================================================
     *
     * Used for static configuration values inserted
     * into the initial widget HTML.
     */

    escapeHTML(value) {

        const div =
            document.createElement("div");


        div.textContent =
            value == null
                ? ""
                : String(value);


        return div.innerHTML;

    }

}
