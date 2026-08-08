/**
 * ============================================================
 * Xavia Widget UI
 * ============================================================
 * Responsible only for rendering the interface.
 * No backend communication belongs here.
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
                💬
            </button>


            <!-- Chat -->

            <section
                id="xavia-chat"
                aria-label="Xavia AI chat"
            >


                <!-- Header -->

                <div id="xavia-header">

                    <div id="xavia-avatar">
                        ${this.config.avatar || "X"}
                    </div>

                    <div>

                        <div id="xavia-business">
                            ${this.config.businessName}
                        </div>

                        <div id="xavia-status">
                            ● Xavia is online
                        </div>

                    </div>

                </div>


                <!-- Conversation -->

                <div
                    id="xavia-messages"
                    aria-live="polite"
                ></div>


                <!-- Input -->

                <div id="xavia-input-area">

                    <textarea
                        id="xavia-input"
                        rows="1"
                        placeholder="Type your message..."
                        aria-label="Message Xavia"
                    ></textarea>


                    <button
                        id="xavia-send"
                        type="button"
                        aria-label="Send message"
                    >
                        ➤
                    </button>

                </div>


                <!-- Footer -->

                <div id="xavia-footer">

                    Powered by
                    <strong>Konnex AI</strong>

                </div>

            </section>

        `;


        document.body.appendChild(root);


        /*
         * Cache DOM elements.
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

            business:
                root.querySelector(
                    "#xavia-business"
                ),

            avatar:
                root.querySelector(
                    "#xavia-avatar"
                )

        };

    }


    /**
     * ========================================================
     * TOGGLE CHAT
     * ========================================================
     */

    toggle() {

        this.elements.chat
            .classList
            .toggle("open");


        const isOpen =
            this.elements.chat
                .classList
                .contains("open");


        if (isOpen) {

            setTimeout(() => {

                this.elements.input.focus();

            }, 200);

        }

    }


    /**
     * ========================================================
     * SET BUSINESS
     * ========================================================
     */

    setBusiness(data) {

        if (data.name) {

            this.elements.business
                .textContent =
                data.name;

        }


        this.elements.avatar
            .textContent =
            data.avatar || "X";

    }


    /**
     * ========================================================
     * ADD MESSAGE
     * ========================================================
     */

    addMessage(role, text) {

        const message =
            document.createElement("div");


        message.className =
            `xavia-message ${role}`;


        const bubble =
            document.createElement("div");


        bubble.className =
            "bubble";


        /*
         * textContent prevents HTML injection.
         */

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

        this.hideTyping();


        const message =
            document.createElement("div");


        message.id =
            "xavia-typing";


        message.className =
            "xavia-message bot";


        message.innerHTML = `

            <div class="xavia-typing-bubble">

                <span></span>
                <span></span>
                <span></span>

            </div>

        `;


        this.elements.messages.appendChild(
            message
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

        this.elements.input.value = "";

        this.autoResizeInput();

    }


    /**
     * ========================================================
     * AUTO RESIZE INPUT
     * ========================================================
     */

    autoResizeInput() {

        const input =
            this.elements.input;


        input.style.height =
            "auto";


        input.style.height =
            Math.min(
                input.scrollHeight,
                120
            ) + "px";

    }


    /**
     * ========================================================
     * SCROLL TO BOTTOM
     * ========================================================
     */

    scrollBottom() {

        const messages =
            this.elements.messages;


        requestAnimationFrame(() => {

            messages.scrollTop =
                messages.scrollHeight;

        });

    }

}
