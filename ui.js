/**
 * ============================================================
 * Xavia Widget UI
 * ============================================================
 * Responsible ONLY for rendering and controlling the interface.
 * No backend/API calls belong here.
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
         * Prevent duplicate widget instances.
         */

        const existing =
            document.getElementById("xavia-widget");

        if (existing) {

            existing.remove();

        }


        const root =
            document.createElement("div");

        root.id =
            "xavia-widget";


        root.innerHTML = `

            <!-- Launcher -->

            <button
                id="xavia-launcher"
                type="button"
                aria-label="Open Xavia chat"
            >
                <span>💬</span>
            </button>


            <!-- Chat Window -->

            <div
                id="xavia-chat"
                role="dialog"
                aria-label="Xavia chat"
                aria-hidden="true"
            >

                <!-- Header -->

                <div id="xavia-header">

                    <div
                        id="xavia-avatar"
                        aria-hidden="true"
                    >
                        ${this.config.avatar || "X"}
                    </div>


                    <div id="xavia-header-info">

                        <div id="xavia-business">
                            ${this.config.businessName || "Xavia AI"}
                        </div>

                        <div id="xavia-status">
                            <span class="xavia-online-dot">
                                ●
                            </span>

                            Xavia is online
                        </div>

                    </div>


                    <button
                        id="xavia-close"
                        type="button"
                        aria-label="Close chat"
                    >
                        ×
                    </button>

                </div>


                <!-- Messages -->

                <div
                    id="xavia-messages"
                    aria-live="polite"
                    aria-atomic="false"
                ></div>


                <!-- Input -->

                <div id="xavia-input-area">

                    <textarea
                        id="xavia-input"
                        placeholder="Type your message..."
                        rows="1"
                        aria-label="Message"
                    ></textarea>


                    <button
                        id="xavia-send"
                        type="button"
                        aria-label="Send message"
                    >
                        <span class="xavia-send-icon">
                            ➤
                        </span>
                    </button>

                </div>


                <!-- Footer -->

                <div id="xavia-footer">
                    Powered by <strong>Konnex AI</strong>
                </div>

            </div>
        `;


        document.body.appendChild(root);


        /*
         * Store references to all UI elements.
         */

        this.elements = {

            root,

            launcher:
                document.getElementById(
                    "xavia-launcher"
                ),

            chat:
                document.getElementById(
                    "xavia-chat"
                ),

            close:
                document.getElementById(
                    "xavia-close"
                ),

            messages:
                document.getElementById(
                    "xavia-messages"
                ),

            input:
                document.getElementById(
                    "xavia-input"
                ),

            send:
                document.getElementById(
                    "xavia-send"
                ),

            business:
                document.getElementById(
                    "xavia-business"
                ),

            avatar:
                document.getElementById(
                    "xavia-avatar"
                )

        };


        /*
         * Make sure the input starts at the
         * correct height.
         */

        this.resizeInput();

    }


    /**
     * ========================================================
     * OPEN / CLOSE / TOGGLE
     * ========================================================
     */

    toggle() {

        if (
            !this.elements.chat
        ) {

            return;

        }


        const isOpen =
            this.elements.chat.classList.toggle(
                "open"
            );


        this.elements.chat.setAttribute(
            "aria-hidden",
            String(!isOpen)
        );


        if (isOpen) {

            /*
             * Focus input when chat opens.
             */

            setTimeout(() => {

                if (this.elements.input) {

                    this.elements.input.focus();

                }

            }, 100);

        }

    }


    close() {

        if (
            !this.elements.chat
        ) {

            return;

        }


        this.elements.chat.classList.remove(
            "open"
        );


        this.elements.chat.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /**
     * ========================================================
     * BUSINESS INFORMATION
     * ========================================================
     */

    setBusiness(data = {}) {

        if (this.elements.business) {

            this.elements.business.textContent =
                data.businessName ||
                data.name ||
                "Xavia AI";

        }


        if (this.elements.avatar) {

            this.elements.avatar.textContent =
                data.avatar ||
                "X";

        }

    }


    /**
     * ========================================================
     * CHECK WHETHER MESSAGES EXIST
     * ========================================================
     */

    hasMessages() {

        if (
            !this.elements.messages
        ) {

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

        if (
            !this.elements.messages
        ) {

            return;

        }


        const message =
            document.createElement("div");


        message.className =
            `xavia-message ${role}`;


        /*
         * Use textContent rather than innerHTML
         * so user/AI messages cannot inject HTML.
         */

        const bubble =
            document.createElement("div");

        bubble.className =
            "bubble";

        bubble.textContent =
            text;


        const time =
            document.createElement("div");

        time.className =
            "time";

        time.textContent =
            formatTime();


        message.appendChild(
            bubble
        );

        message.appendChild(
            time
        );


        this.elements.messages.appendChild(
            message
        );


        this.scrollBottom();

    }


    /**
     * ========================================================
     * TYPING INDICATOR
     * ========================================================
     */

    showTyping() {

        /*
         * Don't create multiple typing indicators.
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

            <div class="bubble typing">

                <span></span>
                <span></span>
                <span></span>

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
     * ERROR MESSAGE
     * ========================================================
     */

    showError(message) {

        this.addMessage(
            "bot",
            "⚠️ " + message
        );

    }


    /**
     * ========================================================
     * CLEAR INPUT
     * ========================================================
     */

    clearInput() {

        if (
            !this.elements.input
        ) {

            return;

        }


        this.elements.input.value =
            "";


        this.resizeInput();

    }


    /**
     * ========================================================
     * RESIZE TEXTAREA
     * ========================================================
     */

    resizeInput() {

        const input =
            this.elements.input;


        if (!input) {

            return;

        }


        /*
         * Reset first so scrollHeight is accurate.
         */

        input.style.height =
            "auto";


        const height =
            Math.min(
                input.scrollHeight,
                120
            );


        input.style.height =
            `${height}px`;

    }


    /**
     * ========================================================
     * SENDING STATE
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


        this.elements.input.disabled =
            isSending;


        if (isSending) {

            this.elements.send.classList.add(
                "sending"
            );

        }

        else {

            this.elements.send.classList.remove(
                "sending"
            );

            /*
             * Return focus to the input after
             * the request finishes.
             */

            setTimeout(() => {

                if (this.elements.input) {

                    this.elements.input.disabled =
                        false;

                    this.elements.input.focus();

                }

            }, 50);

        }

    }


    /**
     * ========================================================
     * AUTO SCROLL
     * ========================================================
     */

    scrollBottom() {

        if (
            !this.elements.messages
        ) {

            return;

        }


        requestAnimationFrame(() => {

            this.elements.messages.scrollTop =
                this.elements.messages.scrollHeight;

        });

    }

}
