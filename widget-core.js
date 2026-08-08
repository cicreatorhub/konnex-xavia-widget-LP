/**
 * ============================================================
 * Xavia Widget Core
 * ============================================================
 * Main widget engine.
 *
 * Responsibilities:
 * - Initialize the widget
 * - Load business configuration
 * - Register UI events
 * - Send messages to the Xavia/Konnex backend
 * - Prevent duplicate message submissions
 * - Handle loading and error states
 * ============================================================
 */

import { DEFAULT_CONFIG } from "./config.js";
import { XaviaAPI } from "./api.js";
import { XaviaUI } from "./ui.js";
import { getSessionId } from "./storage.js";


class XaviaWidget {

    constructor(options = {}) {

        this.config = {
            ...DEFAULT_CONFIG,
            ...options
        };

        this.api =
            new XaviaAPI(this.config);

        this.ui =
            new XaviaUI(this.config);

        this.sessionId =
            getSessionId();

        /*
         * Prevent multiple messages
         * from being sent at the same time.
         */
        this.sending = false;

    }


    /**
     * ========================================================
     * START WIDGET
     * ========================================================
     */

    async start() {

        this.ui.build();

        this.registerEvents();

        await this.loadBusiness();

    }


    /**
     * ========================================================
     * LOAD BUSINESS CONFIGURATION
     * ========================================================
     */

    async loadBusiness() {

        try {

            const business =
                await this.api.getBusiness();


            if (business) {

                this.config.businessName =
                    business.name ||
                    this.config.businessName;


                this.config.avatar =
                    business.avatar ||
                    this.config.avatar;


                this.config.greeting =
                    business.greeting ||
                    this.config.greeting;


                this.config.theme =
                    business.theme ||
                    this.config.theme;

            }

        }

        catch (error) {

            /*
             * The widget should still work even if
             * the business configuration endpoint
             * is temporarily unavailable.
             */

            console.warn(
                "Business configuration unavailable; using defaults.",
                error
            );

        }


        /*
         * Apply whatever configuration we have,
         * whether it came from the backend or
         * DEFAULT_CONFIG.
         */

        this.ui.setBusiness(
            this.config
        );


        this.applyTheme();


        /*
         * Don't add the greeting more than once.
         */

        if (!this.ui.hasMessages()) {

            this.ui.addMessage(
                "bot",
                this.config.greeting
            );

        }

    }


    /**
     * ========================================================
     * APPLY THEME
     * ========================================================
     */

    applyTheme() {

        const theme =
            this.config.theme || {};


        const root =
            document.documentElement;


        const variables = {

            "--xavia-primary":
                theme.primary,

            "--xavia-secondary":
                theme.secondary,

            "--xavia-bg":
                theme.background,

            "--xavia-text":
                theme.text

        };


        for (
            const [key, value]
            of Object.entries(variables)
        ) {

            if (value) {

                root.style.setProperty(
                    key,
                    value
                );

            }

        }

    }


    /**
     * ========================================================
     * REGISTER EVENTS
     * ========================================================
     */

    registerEvents() {

        /*
         * Open chat.
         */

        this.ui.elements.launcher.onclick =
            () => this.ui.toggle();


        /*
         * Close chat.
         */

        this.ui.elements.close.onclick =
            () => this.ui.close();


        /*
         * Send button.
         */

        this.ui.elements.send.onclick =
            () => this.send();


        /*
         * Enter = send.
         *
         * Shift + Enter = new line.
         */

        this.ui.elements.input.onkeydown =
            (event) => {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    this.send();

                }

            };


        /*
         * Automatically resize textarea
         * while the customer types.
         */

        this.ui.elements.input.oninput =
            () => this.ui.resizeInput();

    }


    /**
     * ========================================================
     * SEND MESSAGE
     * ========================================================
     */

    async send() {

        /*
         * Don't allow another request while
         * the previous request is still running.
         */

        if (this.sending) {

            return;

        }


        const message =
            this.ui.elements.input.value.trim();


        /*
         * Ignore empty messages.
         */

        if (!message) {

            return;

        }


        /*
         * Lock sending state.
         */

        this.sending = true;

        this.ui.setSending(true);


        /*
         * Immediately show user's message.
         */

        this.ui.addMessage(
            "user",
            message
        );


        /*
         * Clear input.

         */

        this.ui.clearInput();


        /*
         * Show typing indicator.
         */

        this.ui.showTyping();


        try {

            /*
             * Send message to backend.
             */

            const response =
                await this.api.sendMessage(
                    message,
                    this.sessionId
                );


            /*
             * Remove typing indicator.
             */

            this.ui.hideTyping();


            /*
             * Make sure backend actually
             * returned a reply.
             */

            if (
                !response ||
                !response.reply
            ) {

                throw new Error(
                    "No reply in backend response"
                );

            }


            /*
             * Display AI response.
             */

            this.ui.addMessage(
                "bot",
                response.reply
            );

        }

        catch (error) {

            console.error(
                "Xavia chat error:",
                error
            );


            this.ui.hideTyping();


            this.ui.showError(
                "I'm having trouble connecting right now. Please try again."
            );

        }

        finally {

            /*
             * Always unlock the widget,
             * whether the request succeeded
             * or failed.
             */

            this.sending = false;

            this.ui.setSending(false);

        }

    }

}


/**
 * ============================================================
 * PUBLIC START FUNCTION
 * ============================================================
 *
 * Called by widget.js
 *
 * Example:
 *
 * startWidget({
 *     businessId: "demo"
 * });
 *
 * ============================================================
 */

export function startWidget(options = {}) {

    const widget =
        new XaviaWidget(options);

    widget.start();

}
