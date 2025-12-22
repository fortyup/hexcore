const BASE_URL = 'https://ddragon.leagueoflegends.com';

export const riotApi = {
    version: '15.24.1', // Default, will be updated

    async getLatestVersion() {
        try {
            const response = await fetch(`${BASE_URL}/api/versions.json`);
            const versions = await response.json();
            this.version = versions[0];
            return this.version;
        } catch (e) {
            console.error('Failed to fetch versions', e);
            return this.version; // Fallback
        }
    },

    async getChampions() {
        // Ensure we have the latest version first
        if (!this.versionChecked) {
            await this.getLatestVersion();
            this.versionChecked = true;
        }
        const response = await fetch(`${BASE_URL}/cdn/${this.version}/data/en_US/champion.json`);
        const data = await response.json();
        return Object.values(data.data);
    },

    async getChampionDetail(id) {
        if (!this.versionChecked) {
            await this.getLatestVersion();
            this.versionChecked = true;
        }
        const response = await fetch(`${BASE_URL}/cdn/${this.version}/data/en_US/champion/${id}.json`);
        const data = await response.json();
        return data.data[id];
    },

    getChampionImageUrl(id) {
        return `${BASE_URL}/cdn/img/champion/loading/${id}_0.jpg`;
    },

    getChampionSquareUrl(id) {
        return `${BASE_URL}/cdn/${this.version}/img/champion/${id}.png`;
    },

    getSkinImageUrl(id, skinNum) {
        return `${BASE_URL}/cdn/img/champion/splash/${id}_${skinNum}.jpg`;
    },

    getPassiveImageUrl(filename) {
        return `${BASE_URL}/cdn/${this.version}/img/passive/${filename}`;
    },

    getSpellImageUrl(filename) {
        return `${BASE_URL}/cdn/${this.version}/img/spell/${filename}`;
    },

    getSpellVideoUrl(championKey, spellKey) {
        // format: 0001 (padded to 4 digits)
        const paddedKey = championKey.toString().padStart(4, '0');
        // spellKey: P, Q, W, E, R
        return `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/${paddedKey}/ability_${paddedKey}_${spellKey}1.webm`;
    },

    async getProfileIcons() {
        if (!this.versionChecked) {
            await this.getLatestVersion();
            this.versionChecked = true;
        }
        const response = await fetch(`${BASE_URL}/cdn/${this.version}/data/en_US/profileicon.json`);
        const data = await response.json();
        return Object.values(data.data);
    },

    getProfileIconUrl(iconId) {
        return `${BASE_URL}/cdn/${this.version}/img/profileicon/${iconId}.png`;
    }
};
