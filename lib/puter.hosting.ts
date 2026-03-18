import puter from "@heyputer/puter.js";
import {
    createHostingSlug,
    getHostedUrl,
    getImageExtension,
    HOSTING_CONFIG_KEY,
    imageUrlToPngBlob,
    isHostedUrl,
    fetchBlobFromUrl
} from "./utils";

export const getOrCreateProject = async (): Promise<HostingConfig | null> => {
    const existing = (await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig | null;
    if (existing?.subdomain) return { subdomain: existing.subdomain };
    
    const subdomain = createHostingSlug();
    try {
        const created = await puter.hosting.create(subdomain);
        return { subdomain: created.subdomain };
    } catch (e) {
        console.warn(`could not find subdomain ${subdomain}`);
        return null;
    }
}

export const UploadImageToHosting = async ({
    hosting,
    url,
    projectId,
    label
}: StoreHostedImageParams): Promise<HostedAsset | null> => {
    if (!hosting || !url) return null;
    if (isHostedUrl(url)) return { url };

    try {
        const resolve = label === "rendered"
            ? await imageUrlToPngBlob(url).then((blob) => blob ? { blob, contentType: "image/png" } : null)
            : await fetchBlobFromUrl(url);

        if (!resolve) return null;
        
        const contentType = resolve.contentType || resolve.blob.type || '';
        const ext = getImageExtension(contentType, url);
        const dir = `projects/${projectId}`;
        const filename = `${dir}/${label}.${ext}`;

        const uploadFile = new File([resolve.blob], `${label}.${ext}`, {
            type: contentType,
        });

        await puter.fs.mkdir(dir, { createMissingParents: true });
        await puter.fs.write(filename, uploadFile);

        const hostedUrl = getHostedUrl({ subdomain: hosting.subdomain }, filename);
        return hostedUrl ? { url: hostedUrl } : null;
    } catch (e) {
        console.error(`failed to upload image to hosting :`, e);
        return null;
    }
}