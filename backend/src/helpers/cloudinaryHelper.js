const cloudinary = require('../config/cloudinary');

const publicIdWithoutExtensionFromUrl = async (imageUrl) => {
    const pathSegments = imageUrl.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    const valueWithoutExtension = lastSegment.split(".")[0];

    return valueWithoutExtension;
}

const deleteFileFromCloudinary = async (folderName, publicId, modelName) => {
    const { result } = await cloudinary.uploader.destroy(`ecommerceMern/${folderName}/${publicId}`);

    if (result !== 'ok') {
        throw createError(400, `${modelName} image was not deleted`);
    }
}


module.exports = { publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary }