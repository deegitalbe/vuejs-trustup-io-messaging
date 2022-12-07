const getRealVariable = key => {
    let value;

    try {
        value = process.env[`MIX_${key}`];
    } catch (error) {}
    if (value) return value;

    try {
        value = import.meta.env[`VITE_${key}`];
    } catch (error) {}
  
    return value;
};

/**
 * Get environment variable.
 * @param {string} key Environment key to search for (without VITE_ or MIX_ prefix)
 * @param {?string} defaultValue Default value if not present in environment.
 * @returns {?string}
 */
const getVariable = (key, defaultValue = null) => getRealVariable(key) || defaultValue;

const env = { getVariable };

export { getVariable as getEnvironmentVariable };
export default env;
