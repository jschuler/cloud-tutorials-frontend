const loadJSONTutorialsFilesFromAssets = async (basePath: string): Promise<string[]> => {
    const data = await fetch(`${basePath}/webpack-assets.json`).then(response => response.json());
    const files = Array.isArray(data[""]["yml"]) ? data[""]["yml"] : [data[""]["yml"]];
    return files.map(file => {
        const fileChunks = file.split('/');
        return `${basePath}/tutorials/${fileChunks[fileChunks.length - 2]}.tutorial.json`
    });
    // return files.filter(url => url.endsWith(".quickstart.json")).map(e => !e.startsWith("http") ? `${basePath}/${e}`: e);
}

export const loadJSONTutorials = async(basePath: string) => {
    const files = await loadJSONTutorialsFilesFromAssets(basePath);
    const result = [] as any[];
    for (let i = 0; i < files.length; i++) {
        await fetch(files[i]).then(response => response.json().then(data => result.push(data)));
    }
    return result;
}
