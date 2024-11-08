
const publicIdWithoutExtensionFromUrl = async (imageUrl) => {
    const pathSegments = imageUrl.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const valueWithoutExtension = lastSegment.split(".")[0];

    return valueWithoutExtension;
}


module.exports = { publicIdWithoutExtensionFromUrl }