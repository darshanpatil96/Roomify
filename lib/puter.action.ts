import puter from "@heyputer/puter.js";
import { isHostedUrl } from "./utils";
import { getOrCreateProject, UploadImageToHosting } from "./puter.hosting";

export const signIn = async () => await puter.auth.signIn();
export const signOut = () => puter.auth.signOut();
export const getCurrentUser = async () => {
    try {
        return await puter.auth.getUser();
    } catch {
        return null;
    }
}

export const createProject = async ({ item }: CreateProjectParams): Promise<DesignItem | null | undefined> => {
    const projectId = item.id;
    const hosting = await getOrCreateProject();
    
    const hostedSource = projectId ?
        await UploadImageToHosting({
            hosting,
            url: item.sourceImage,
            projectId,
            label: "source"
        }) : null;

    const hostedRendered = item.renderedImage ?
        await UploadImageToHosting({
            hosting,
            url: item.renderedImage,
            projectId,
            label: "rendered"
        }) : null;

    const resolvedSource = hostedSource?.url || (isHostedUrl(item.sourceImage) ? item.sourceImage : item.sourceImage);
    const resolvedRendered = hostedRendered?.url || (item.renderedImage && isHostedUrl(item.renderedImage) ? item.renderedImage : item.renderedImage);

    if (!resolvedSource) {
        console.error("failed to resolve source image");
        return null;
    }

    const resolvedItem = hostedSource?.url
    ?hostedSource?.url
    :item.renderedImage && isHostedUrl(item.renderedImage)
    ?item.renderedImage
    : undefined;


    const {
        sourcePath:_sourcePath,
        renderedPath:_renderedPath,
        publicPath:_publicPath,
        ...rest
    } = item;
    const payload = {
        ...rest,
        sourceImage: resolvedSource,
        renderedImage: resolvedRendered,
    }

    try{  
        return payload;  
    }catch(e){
        console.log('failed to seve project',e)
        return null;
    }
}
