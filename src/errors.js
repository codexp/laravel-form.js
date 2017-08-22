/**
 * this file was based on work from following link
 * @link https://github.com/laracasts/Vue-Forms/blob/master/public/js/app.js
 * @copyright The Laravel framework is open-sourced software licensed under the MIT license.
 */

class Errors {
    /**
     * Create a new Errors instance.
     */
    constructor() {
        this.errors = {};
    }


    /**
     * Determine if an errors exists for the given field.
     *
     * @param {string} field
     */
    has(field) {
        return this.errors.hasOwnProperty(field);
    }


    /**
     * Determine if we have any errors.
     */
    any(fields) {
        let has = false;
        if (!fields) {
            has = (Object.keys(this.errors).length > 0);
        } else {
            for (name of fields) {
                if (this.has(name)) {
                    has = true;
                    break;
                }
            }
        }
        return has;
    }


    /**
     * Retrieve the error message for a field.
     *
     * @param {string} field
     */
    get(field) {
        if (this.has(field)) {
            return _.isArray(this.errors[field]) ? this.errors[field][0] : this.errors[field];
        }
    }


    /**
     * Add an error message for a field.
     *
     * @param {string} field
     * @param {string} message
     */
    add(field, message) {

        if (!this.errors[field]) {
            Vue.set(this.errors, field, []);
        }
        else if (!_.isArray(this.errors[field])) {
            Vue.set(this.errors, field, [this.errors[field]]);
        }

        // add only once
        if (-1 === this.errors[field].indexOf(message)) {
            this.errors[field].unshift(message);
        }
    }


    /**
     * Record the new errors.
     *
     * @param {object} errors
     */
    record(errors) {
        this.errors = errors;
    }


    /**
     * Clear one or all error fields.
     *
     * @param {string|undefined} field
     */
    clear(field = undefined) {
        if (undefined === field) {
            this.errors = {};

            return;
        }

        this.errors[field] = false;

        delete this.errors[field];
    }
}

export default Errors;
