/**
 * this file was based on work from following link
 * @link https://github.com/laracasts/Vue-Forms/blob/master/public/js/app.js
 * @copyright The Laravel framework is open-sourced software licensed under the MIT license.
 */

import _        from 'lodash';
import Errors   from './errors';

class Form {
    /**
     * Create a new Form instance.
     *
     * @param {object} data
     */
    constructor(data) {

        this.defaults = data;

        // backup and copy to form
        this.originalData = _.extend({}, data);
        _.extend(this, data);

        this.errors = new Errors();
    }

    /**
     * iterate through form fields.
     *
     * @param {function} callback
     */
    each(callback) {

        callback.bind(this);

        for (let field in this.defaults) {
            if (false === callback(field, this[field])) {
                break;
            }
        }

        return this;
    }

    /**
     * Fetch all relevant data for the form.
     */
    data() {
        let data = {};

        this.each((field, value) => { data[field] = value });

        return data;
    }

    /**
     * Check if the form has such field.
     *
     * @param {string} field
     * @return {boolean}
     */
    has(field) {
        return this.defaults.hasOwnProperty(field);
    }


    /**
     * Return old value of a field.
     *
     * @param {string} field
     */
    old(field) {
        return this.originalData[field];
    }

    /**
     * Check if the field value has changed.
     *
     * @param {string|undefined} field
     * @return {boolean}
     */
    changed(field = undefined) {

        if (undefined === field) {
            let changed = false;

            this.each((field, value) => {
                if (value !== this.originalData[field]) {
                    changed = true;
                    return false;
                }
            });

            return changed;
        }

        return this[field] !== this.originalData[field];
    }

    /**
     * Reset the form.
     *
     * @param {{}|undefined} defaults
     */
    reset(defaults = undefined) {
        //@TODO reset to what? originalData or defaults?
        if (undefined === defaults) {
            defaults = this.defaults;
        }

        this.errors.clear();

        this.each(field => {
            this[field] = defaults[field];
            // restore original data
            this.originalData[field] = defaults[field];
        });

        return this;
    }

    /**
     * Send a POST request to the given URL.
     *
     * @param {string} url
     * @param {boolean} dataOnly - pass only data from response
     */
    post(url, dataOnly = true) {
        return this.submit('post', url, dataOnly);
    }

    /**
     * Send a PUT request to the given URL.
     *
     * @param {string} url
     * @param {boolean} dataOnly - pass only data from response
     */
    put(url, dataOnly = true) {
        return this.submit('put', url, dataOnly);
    }

    /**
     * Send a PATCH request to the given URL.
     *
     * @param {string} url
     * @param {boolean} dataOnly - pass only data from response
     */
    patch(url, dataOnly = true) {
        return this.submit('patch', url, dataOnly);
    }

    /**
     * Send a DELETE request to the given URL.
     *
     * @param {string} url
     * @param {boolean} dataOnly - pass only data from response
     */
    delete(url, dataOnly = true) {
        return this.submit('delete', url, dataOnly, false);
    }

    /**
     * Submit the form.
     *
     * @param {string} requestType
     * @param {string} url
     * @param {boolean} dataOnly - pass only data from response
     * @param {boolean} sendData - if true send form data
     */
    submit(requestType, url, dataOnly = true, sendData = true) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, sendData ? this.data() : undefined)
                .then(result => {
                    resolve(dataOnly ? result.data : result);
                })
                .catch(error => {
                    this.onFail(
                        error.response.data,
                        error.response.status,
                        error.response.statusText
                    );

                    reject(error);
                });
        });
    }

    /**
     * Handle a failed form submission.
     *
     * @param {object} errors
     * @param {number} status
     * @param {string} statusText
     */
    onFail(errors, status, statusText) {

        if (status === 422) {
            this.errors.record(errors);
        } else {
            this.errors.record({
                general: [status + ' ' + statusText]
            });
        }

        return this;
    }
}

export default Form;
