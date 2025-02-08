export async function loadEnv() {
    const response = await fetch('../../.env');
    const envData = await response.text();
    const envVariables = envData.split('\n').reduce((acc, line) => {
        const [key, value] = line.split('=');
        if (key && value) {
            acc[key.trim()] = value.trim();
        }
        return acc;
    }, {});
    return envVariables;
}
