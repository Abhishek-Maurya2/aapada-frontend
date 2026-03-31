import Constants from 'expo-constants';

const GITHUB_API_BASE = 'https://api.github.com';

const normalizeVersion = (value) => {
    if (!value) return '0.0.0';
    const parts = String(value)
        .replace(/^v/i, '')
        .split(/[^0-9]+/)
        .filter(Boolean)
        .slice(0, 3)
        .map((n) => Number.parseInt(n, 10));

    while (parts.length < 3) {
        parts.push(0);
    }

    return parts.join('.');
};

const compareVersions = (a, b) => {
    const av = normalizeVersion(a).split('.').map((n) => Number.parseInt(n, 10));
    const bv = normalizeVersion(b).split('.').map((n) => Number.parseInt(n, 10));

    for (let i = 0; i < 3; i += 1) {
        if (av[i] > bv[i]) return 1;
        if (av[i] < bv[i]) return -1;
    }

    return 0;
};

const getGithubRepoConfig = () => {
    const cfg = Constants.expoConfig?.extra?.githubUpdate || {};

    return {
        owner: cfg.owner || '',
        repo: cfg.repo || '',
        channel: cfg.channel === 'all' ? 'all' : 'stable',
    };
};

const pickApkAsset = (assets = []) => {
    if (!Array.isArray(assets)) return null;
    const apkAssets = assets.filter((item) => item?.name?.toLowerCase().endsWith('.apk'));
    if (!apkAssets.length) return null;

    const releaseNamed = apkAssets.find((asset) => asset.name.toLowerCase().includes('release'));
    return releaseNamed || apkAssets[0];
};

const getRelease = async (owner, repo, channel) => {
    if (channel === 'all') {
        const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`);
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
        }

        const releases = await response.json();
        return releases.find((r) => !r.draft) || null;
    }

    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases/latest`);
    if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
    }

    return response.json();
};

export const checkGithubApkUpdate = async () => {
    const { owner, repo, channel } = getGithubRepoConfig();

    if (!owner || !repo) {
        return {
            ok: false,
            message: 'GitHub updater is not configured. Set expo.extra.githubUpdate.owner and repo in app.json.',
        };
    }

    const release = await getRelease(owner, repo, channel);
    if (!release) {
        return { ok: false, message: 'No GitHub release found.' };
    }

    const apkAsset = pickApkAsset(release.assets);
    if (!apkAsset?.browser_download_url) {
        return {
            ok: false,
            message: 'Latest release does not include an APK asset.',
        };
    }

    const currentVersion = normalizeVersion(Constants.expoConfig?.version || '0.0.0');
    const latestVersion = normalizeVersion(release.tag_name || release.name || '0.0.0');
    const updateAvailable = compareVersions(latestVersion, currentVersion) > 0;

    return {
        ok: true,
        currentVersion,
        latestVersion,
        updateAvailable,
        apkUrl: apkAsset.browser_download_url,
        releaseUrl: release.html_url,
        releaseName: release.name || release.tag_name || '',
    };
};
