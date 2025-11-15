/**
 * @file brix.js
 * @description A reusable OOP-style JS Module for Brix IT Consulting website
 * @feature
 *   - AJAX GET/POST request
 *   - JSON response handling
 *   - SweetAlert2 integration
 *   - Loading and error feedback
 * @dependencies JQuery, SweetAlert2
 * @author Jobet P. Casquejo
 * @date 2025-11-15
 * @version 1.0.0
 */

class GlobalHandler {
    constructor(options = {}) {
        this.defaultHeader = options.header || { 'Content-Type': 'application/json' };
        this.csrfToken = this.getCsrfToken();
        this.loaderElement = document.querySelector('#global-loader');
    }

    /**
     * Detect CSRF token from meta tag
     */
    getCsrfToken() {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : null;
    }

    /**
     * Show SweetAlert2 toast notification
     */
    notify(message, icon = 'info', timer = 2000) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: icon,
            title: message,
            showConfirmButton: false,
            timer: timer,
            timerProgressBar: true
        });
    }

    /**
     * AJAX GET Request
     */
    get(url, successCallback, errorCallback) {
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: (response) => {
                if(typeof successCallback === 'function') {
                    successCallback(response);
                }
            },
            error: (xhr, status, error) => {
                this.handleError(xhr, status, error);
                if(typeof errorCallback === 'function') {
                    errorCallback(xhr, status, error);
                }
            }
        });
    }

    /**
     * AJAX POST Request with CSRF token
     */
    post(url, data, successCallback, errorCallback) {
        $.ajax({
            url: url,
            method: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
            headers: {
                ...this.defaultHeader,
                'X-CSRFToken': this.csrfToken
            },
            beforeSend: () => this.showLoader(),
            success: (response) => {
                this.hideLoader();
                if(typeof successCallback === 'function') {
                    successCallback(response);
                }
            },
            error: (xhr, status, error) => {
                this.hideLoader();
                this.handleError(xhr, status, error);
                if(typeof errorCallback === 'function') {
                    errorCallback(xhr, status, error);
                }
            }
        });
    }

    /**
     * File Upload Handler (multipart/form-data)
     */
    upload(url, formData, successCallback, errorCallback) {
        $.ajax({
            url: url,
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: { 'X-CSRFToken': this.csrfToken },
            beforeSend: () => this.showLoader(),
            success: (response) => {
                this.hideLoader();
                if(typeof successCallback === 'function') {
                    successCallback(response);
                }
            },
            error: (xhr, status, error) => {
                this.hideLoader();
                this.handleError(xhr, status, error);
                if(typeof errorCallback === 'function') {
                    errorCallback(xhr, status, error);
                }
            }
        });
    }

    /**
     * Global Error Handler
     */
    handleError(xhr, status, error) {
        console.error('AJAX Error:', status, error, xhr?.responseText);
        this.notify('An error occurred while processing your request.', 'error', 3000);
    }

    /**
     * SweetAlert Confirmation Dialog
     */
    confirm(title = 'Are you sure?', text = '', onConfirm = null) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            }
        });
    }

    /**
     * Fetch JSON using async/await
     */
    async fetchJson(url) {
        try {
            const response = await $.getJSON(url);
            return response;
        } catch (error) {
            this.handleError(null, 'Fetch Error', error.message);
            return null;
        }
    }

    /**
     * Show global loader
     */
    showLoader() {
        if (this.loaderElement) {
            this.loaderElement.style.display = 'flex';
        }
    }

    /**
     * Hide global loader
     */
    hideLoader() {
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }

    /**
     * Serialize form to JSON
     */
    formToJson(form) {
        const formData = new FormData(form);
        const json = {};
        formData.forEach((value, key) => {
            json[key] = value;
        });
        return json;
    }

    /**
     * Redirect utility
     */
    goTo(url) {
        window.location.href = url;
    }
}

const globalHandler = new GlobalHandler();

window.globalHandler = globalHandler;