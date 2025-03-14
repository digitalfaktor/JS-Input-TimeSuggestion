# JS Input TimeSuggestion

**JS Input TimeSuggestion** is an open-source JavaScript library that enhances time input fields with autocomplete suggestions, validation, and automatic conversion of various time formats to a standard format.

![gif](https://github.com/user-attachments/assets/6cb64fe3-13a0-4dab-a5ed-a9ec41d603b1)

## Overview

This library allows users to enter time values in multiple formats (e.g. `3h15`, `15m`, `01:30:00`, `3:15`, `3.15`) and provides:

- A dropdown with autocomplete suggestions.
- Automatic parsing and validation of the input.
- Conversion and storage of the valid time in a hidden field using the standard format `hh:mm:ss`.
- Bootstrap-compatible validation (adding the `is-invalid` class when needed).
- Prevention of form submission if an invalid value is entered, similar to native HTML5 validation (e.g. for email).

## Features

- **Multiple Input Formats:**  
  Supports formats such as:
  - `3h15` or `3h` for hours and minutes.
  - `15m` for minutes only.
  - `3:15` or `3.15` as colon- or dot-separated hours and minutes.
  - `01:30:00` as the standard time format (hh:mm:ss).

- **Dropdown Suggestions:**  
  Displays suggestions based on valid input.

- **Hidden Input Storage:**  
  Stores the parsed time value in a hidden input field. This hidden field is submitted with the form in the desired output format.

- **Form Validation:**  
  Prevents form submission if the input is invalid and shows a custom native validation message.

- **Configurable:**  
  Easily configurable options to adjust the output format, validation messages, and CSS class names.

- **Multi-field Support:**  
  Apply the functionality to multiple fields simply by adding the `timesuggestion` class.

## Installation

1. **Download or Clone the Repository**

Clone the repository from GitHub:

    git clone https://github.com/digitalfaktor/JSInputTimeSuggestion.git

2. **Include the Script**

Include the JavaScript file in your HTML:

    <script src="path/to/js-input-time-suggestion.js"></script>

## Usage

1. **Mark Your Input Fields**

Add the class timesuggestion to any input field you want to enhance. For example:

    <input type="text" class="timesuggestion" name="estimated_time" placeholder="Enter time">

2. **Initialize the Library**

Initialize the library with an optional configuration object. You can do this in a `<script>` tag:

    <script>
    JSInputTimeSuggestion.init({
        inputClass: "timesuggestion",  // CSS class for the input field
        outputFormat: "h:m:s", // Output format for the hidden input (currently only "h:m:s" is supported)
        invalidMessage: "Please enter a valid time (e.g. 3h15 or 01:30:00).",
        suggestionClass: "dropdown-item", // CSS class for suggestion items
        dropdownMenuClass: "dropdown-menu", // CSS class for the dropdown container
        dropdownContainerClass: "dropdown", // CSS class for the outer container
        autoParseOnLoad: true // Automatically parse any initial input values on page load
    });
    </script>

The library will automatically:
- Parse any initial value (expected in hh:mm:ss format) if present.
- Create a hidden input to store the processed time value.
- Display a suggestion dropdown for valid inputs.
- Validate the input and prevent form submission if the entered value is invalid.

## Configuration Options

- **inputClass: (string)**  
The class of the target input field.

- **outputFormat: (string)**  
The output format for the hidden input. Currently supports "h:m:s" (default: "h:m:s").

- **invalidMessage: (string)**  
The custom validation error message to display when the input is invalid.

- **suggestionClass: (string)**  
CSS class applied to each suggestion item in the dropdown (default: "dropdown-item").

- **dropdownMenuClass: (string)**  
CSS class for the dropdown menu container (default: "dropdown-menu").

- **dropdownContainerClass: (string)**  
CSS class for the container holding the input field and the dropdown (default: "dropdown").

- **autoParseOnLoad: (boolean)**  
When true, the library automatically parses and formats any initial value on page load (default: true).

## Licence

This project is licensed under the MIT LICENSE.

## Contributing

Contributions, bug reports, and feature requests are welcome!
Please open an issue or submit a pull request on GitHub.

## Author

Made in Austria by [Digitalfaktor Services](https://digitalfaktor.at)
