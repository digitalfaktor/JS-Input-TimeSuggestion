/*! https://www.digitalfaktor.at v1.0.0 by @digitalfaktor | MIT license */
/**
 * JS Input TimeSuggestion
 * 
 * A JavaScript library that adds time input suggestion functionality to input fields.
 * It supports various time formats and automatically shows an autocomplete dropdown.
 * The valid input is converted and stored in a hidden field in the desired output format.
 * 
 * Supported input formats:
 *   - "3h15", "3h", "15m"
 *   - "3:15", "01:30:00" (colon separated, h:m or h:m:s)
 *   - "3.15" (dot as separator)
 * 
 * Usage:
 *   1. Include this script in your HTML.
 *   2. Add the class "timesuggestion" to any input field you want to enhance.
 *   3. Optionally configure settings via the init function:
 *        JSInputTimeSuggestion.init({ outputFormat: "h:m:s", invalidMessage: "Your custom message", ... });
 * 
 * When an invalid value is entered, the form will not be submitted and a native validation
 * message will be shown).
 */

(function(window, document) {
    // Default configuration options
    const defaultConfig = {
        // Class of input fields
        inputClass: "timesuggestion",
        // The output format for the hidden input (currently only "h:m:s" is supported)
        outputFormat: "h:m:s",
        // Validation error message for invalid time input
        invalidMessage: "Please enter a valid time (e.g. 3h15 or 01:30:00).",
        // CSS class for suggestion items
        suggestionClass: "dropdown-item",
        // CSS class for the dropdown container
        dropdownMenuClass: "dropdown-menu",
        // CSS class for the outer container holding the input and suggestions
        dropdownContainerClass: "dropdown",
        // Automatically parse the initial value if present on page load
        autoParseOnLoad: true
    };

    // Merge user configuration with the default configuration
    function mergeConfig(userConfig) {
        const config = {};
        for (let key in defaultConfig) {
            config[key] = (userConfig && (key in userConfig)) ? userConfig[key] : defaultConfig[key];
        }
        return config;
    }

    // Main initialization function to bind the time suggestion functionality to input fields
    function init(userConfig) {
        const config = mergeConfig(userConfig);
        // Select all input elements with the "timesuggestion" class
        const timeInputs = document.querySelectorAll("input." + config.inputClass);
        timeInputs.forEach(function(inputField) {
            // Create a hidden input to store the output value (in the desired format)
            let hiddenName = inputField.getAttribute("name");
            if (hiddenName) inputField.removeAttribute("name");
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            if (hiddenName) hiddenInput.name = hiddenName;

            // Create a container for the input field and the dropdown suggestions
            const dropdownContainer = document.createElement("div");
            dropdownContainer.className = config.dropdownContainerClass;
            inputField.parentNode.insertBefore(dropdownContainer, inputField);
            dropdownContainer.appendChild(inputField);
            dropdownContainer.appendChild(hiddenInput);

            // Create the dropdown element for suggestions
            const suggestionsDiv = document.createElement("div");
            suggestionsDiv.className = config.dropdownMenuClass;
            dropdownContainer.appendChild(suggestionsDiv);

            /**
             * Parse the user input string into an object with hours, minutes, and seconds.
             * Supports various input formats. Returns null if input is invalid.
             */
            function parseDuration(input) {
                input = input.trim().toLowerCase().replace(/\s+/g, '');
                if (input === "") return null;
                let hours = 0, minutes = 0, seconds = 0, valid = false, match;
                // Format: hh:mm:ss (e.g. "01:30:00")
                if (input.split(':').length === 3) {
                    match = input.match(/^(\d+):(\d+):(\d+)$/);
                    if (match) {
                        valid = true;
                        hours = parseInt(match[1], 10);
                        minutes = parseInt(match[2], 10);
                        seconds = parseInt(match[3], 10);
                    }
                } else if (input.includes('h')) {
                    // Format with hours (e.g. "3h15")
                    match = input.match(/^(\d+)(?:h|hours)?(?:[:.]?(\d+))?$/i);
                    if (match) {
                        valid = true;
                        hours = parseInt(match[1], 10);
                        if (match[2]) minutes = parseInt(match[2], 10);
                        seconds = hours * 3600 + minutes * 60;
                    }
                } else if (input.includes('m')) {
                    // Format with minutes only (e.g. "15m")
                    match = input.match(/^(\d+)(?:m|min(?:utes)?)?$/i);
                    if (match) {
                        valid = true;
                        minutes = parseInt(match[1], 10);
                        seconds = minutes * 60;
                    }
                } else {
                    // Handle colon-separated "3:15" or dot-separated "3.15" formats, or default to hours (with optional minutes)
                    if (input.indexOf(':') !== -1) {
                        let parts = input.split(':');
                        if (parts.length === 2) {
                            valid = true;
                            hours = parseInt(parts[0], 10);
                            minutes = parseInt(parts[1], 10);
                            seconds = hours * 3600 + minutes * 60;
                        }
                    } else if (input.indexOf('.') !== -1) {
                        let parts = input.split('.');
                        if (parts.length === 2) {
                            valid = true;
                            hours = parseInt(parts[0], 10);
                            minutes = parseInt(parts[1], 10);
                            seconds = hours * 3600 + minutes * 60;
                        }
                    } else {
                        match = input.match(/^(\d+)(?:[:.]?(\d+))?$/);
                        if (match) {
                            valid = true;
                            hours = parseInt(match[1], 10);
                            if (match[2]) minutes = parseInt(match[2], 10);
                            seconds = hours * 3600 + minutes * 60;
                        }
                    }
                }
                return valid ? { hours, minutes, seconds } : null;
            }

            /**
             * Format the parsed duration as a suggestion string to be shown in the dropdown.
             * For example, "3h15" or "15m" if there are no hours.
             */
            function formatSuggestion(duration) {
                if (duration.hours === 0 && duration.minutes > 0) return duration.minutes + "m";
                let s = duration.hours + "h";
                if (duration.minutes) s += " " + duration.minutes + "m";
                return s;
            }

            /**
             * Format the duration object into the output format.
             * Currently supports only "h:m:s" which outputs in HH:MM:SS format.
             */
            function formatHMS(duration) {
                let h = String(duration.hours).padStart(2, '0');
                let m = String(duration.minutes).padStart(2, '0');
                let s = String(duration.seconds % 60).padStart(2, '0');
                return h + ":" + m + ":" + s;
            }

            /**
             * Update the validity state of the input field.
             * If the field is not required and empty, it is considered valid.
             * Otherwise, sets a custom validity message if the input is invalid.
             */
            function updateValidity(duration) {
                if (inputField.value.trim() === "" && !inputField.required) {
                    inputField.classList.remove("is-invalid");
                    hiddenInput.value = "";
                    inputField.setCustomValidity("");
                    return;
                }
                if (duration) {
                    inputField.classList.remove("is-invalid");
                    inputField.setCustomValidity("");
                } else {
                    inputField.classList.add("is-invalid");
                    hiddenInput.value = "";
                    inputField.setCustomValidity(config.invalidMessage);
                }
            }

            // If an initial value exists and autoParseOnLoad is enabled, parse it.
            if (config.autoParseOnLoad && inputField.value.trim() !== "") {
                const duration = parseDuration(inputField.value);
                updateValidity(duration);
                if (duration) {
                    inputField.value = formatSuggestion(duration);
                    hiddenInput.value = (config.outputFormat === "h:m:s") ? formatHMS(duration) : formatHMS(duration);
                }
            }

            // Event listener for user input changes
            inputField.addEventListener("input", function() {
                suggestionsDiv.innerHTML = "";
                const duration = parseDuration(inputField.value);
                updateValidity(duration);
                if (duration) {
                    hiddenInput.value = (config.outputFormat === "h:m:s") ? formatHMS(duration) : formatHMS(duration);
                    const suggestionText = formatSuggestion(duration);
                    const suggestionItem = document.createElement("button");
                    suggestionItem.type = "button";
                    suggestionItem.className = config.suggestionClass;
                    suggestionItem.textContent = suggestionText;
                    suggestionItem.addEventListener("click", function() {
                        inputField.value = suggestionText;
                        hiddenInput.value = (config.outputFormat === "h:m:s") ? formatHMS(duration) : formatHMS(duration);
                        suggestionsDiv.classList.remove("show");
                    });
                    suggestionsDiv.appendChild(suggestionItem);
                    suggestionsDiv.classList.add("show");
                } else {
                    suggestionsDiv.classList.remove("show");
                }
            });

            // When the input loses focus, validate and format the value
            inputField.addEventListener("blur", function() {
                const duration = parseDuration(inputField.value);
                updateValidity(duration);
                if (duration) {
                    inputField.value = formatSuggestion(duration);
                    hiddenInput.value = (config.outputFormat === "h:m:s") ? formatHMS(duration) : formatHMS(duration);
                }
            });

            // Hide the suggestions dropdown when clicking outside of the input or suggestions
            document.addEventListener("click", function(e) {
                if (!inputField.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                    suggestionsDiv.classList.remove("show");
                }
            });

            // Prevent form submission if the input is invalid
            if (inputField.form) {
                inputField.form.addEventListener("submit", function(e) {
                    if (!inputField.checkValidity()) {
                        inputField.reportValidity();
                        e.preventDefault();
                    }
                });
            }
        });
    }

    // Expose the library to the global scope under the name "JSInputTimeSuggestion"
    window.JSInputTimeSuggestion = {
        init: init,
        defaultConfig: defaultConfig
    };
})(window, document);
