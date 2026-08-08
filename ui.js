/**
 * ============================================================
 * Xavia Widget UI
 * ============================================================
 * Responsible ONLY for rendering the widget interface.
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
     * BUILD
     * ========================================================
     */

    build() {

        const existing =
            document.getElementById("xavia-widget");

        if (existing) {

            existing.remove();

        }


        const root =
            document.createElement("div");

        root.id = "xavia-widget";


        root.innerHTML = `

            <!-- Floating Launcher -->

            <button
                id="xavia-launcher"
                type="button"
                aria-label="Open Xavia chat"
            >
                💬
            </button>


            <!-- Chat Window -->

            <div
                id="xavia-chat"
                aria-hidden="true"
            >


                <!-- Header -->

                <div id="xavia-header">

                    <div
                        id="xavia-avatar"
                        aria-hidden="true"
                    >
                        ${this.escapeHTML(
                            this.config.avatar || "X"
                        )}
                    </div>


                    <div id="xavia-business-info">

                        <div id="xavia-business">
                            ${this.escapeHTML(
                                this.config.businessName ||
                                "Xavia AI"
                            )}
                        </div>


                        <div id="xavia-status">

                            <span id="xavia-status-dot">
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
                    role="log"
                    aria-live="polite"
                ></div>


                <!-- Input -->

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
                    >

                        <span id="xavia-send-icon">
                            ➤
                        </span>

                    </button>

                </div>


                <!-- Footer -->

                <div id="xavia-powered-by">

                    Powered by
                    <strong>Konnex AI</strong>

                </div>


            </div>
        `;


        document.body.appendChild(root);


        /*
         * Cache elements
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
                )

        };


        this.resizeInput();

    }


    /**
     * ========================================================
     * TOGGLE
     * ========================================================
     */

    toggle() {

        if (
            this.elements.chat.classList.contains(
                "open"
            )
        ) {

            this.close();

        } else {

            this.open();

        }

    }


    /**
     * ========================================================
     * OPEN
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


        this.scrollBottom();


        setTimeout(() => {

            if (this.elements.input) {

                this.elements.input.focus();

            }

        }, 200);

    }


    /**
     * ========================================================
     * CLOSE
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
     * BUSINESS INFORMATION
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

    }


    /**
     * ========================================================
     * CHECK MESSAGES
     * ========================================================
     */

    hasMessages() {

        return (
            this.elements.messages &&
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


        const wrapper =
            document.createElement("div");


        wrapper.className =
            `xavia-message ${role}`;


        const bubble =
            document.createElement("div");


        bubble.className =
            "bubble";


        /*
         * textContent prevents HTML injection.
         */

        bubble.textContent =
            text == null
                ? ""
                : String(text);


        const time =
            document.createElement("div");


        time.className =
            "time";


        time.textContent =
            formatTime();


        wrapper.appendChild(
            bubble
        );

        wrapper.appendChild(
            time
        );


        this.elements.messages.appendChild(
            wrapper
        );


        this.scrollBottom();

    }


    /**
     * ========================================================
     * TYPING INDICATOR
     * ========================================================
     */

    showTyping() {

        if (
            document.getElementById(
                "xavia-typing"
            )
        ) {

            return;

        }


        const typing =
            document.createElement("div");


        typing.id =
            "xavia-typing";


        typing.className =
            "xavia-message bot";


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
     * HIDE TYPING
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
     * ERROR
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

        this.elements.input.value = "";

        this.resizeInput();

    }


    /**
     * ========================================================
     * RESIZE INPUT
     * ========================================================
     */

    resizeInput() {

        const input =
            this.elements.input;


        if (!input) {

            return;

        }


        input.style.height =
            "auto";


        const maxHeight =
            120;


        input.style.height =
            `${Math.min(
                input.scrollHeight,
                maxHeight
            )}px`;

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
     * SCROLL
     * ========================================================
     */

    scrollBottom() {

        if (!this.elements.messages) {

            return;

        }


        requestAnimationFrame(() => {

            this.elements.messages.scrollTop =
                this.elements.messages.scrollHeight;

        });

    }


    /**
     * ========================================================
     * ESCAPE HTML
     * ========================================================
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
