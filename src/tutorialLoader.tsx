const loadJSONTutorialsFilesFromAssets = async (basePath: string): Promise<string[]> => {
    const data = await fetch(`${basePath}/webpack-assets.json`).then(response => response.json());
    const files = Array.isArray(data[""]["json"]) ? data[""]["json"] : [data[""]["json"]];
    return files.filter(url => url.indexOf("/tutorials/") >= 0);
}

export const loadJSONTutorials = async(basePath: string) => {
    const files = await loadJSONTutorialsFilesFromAssets(basePath);
    const result = [] as any[];
    for (let i = 0; i < files.length; i++) {
        await fetch(files[i]).then(response => response.json().then(data => result.push(data)));
    }
    return result;
}
