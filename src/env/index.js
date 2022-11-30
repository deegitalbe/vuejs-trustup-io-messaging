const getViteVariable = key => import.meta?.env?.[`VITE_${key}`];
const getMixVariable = key => process?.env?.[`MIX_${key}`];
/**
 * Get environment variable.
 * @param {string} key Environment key to search for (without VITE_ or MIX_ prefix)
 * @param {?string} defaultValue Default value if not present in environment.
 * @returns {?string}
 */
const getVariable = (key, defaultValue = null) => getMixVariable(key) || getViteVariable(key) || defaultValue;

const env = {
    getMixValue,
    getViteValue,
    getValue
};

export { getVariable as getEnvironmentVariable };
export default env;
