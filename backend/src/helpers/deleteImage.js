const fs = require('fs').promises;

// const deleteImage = (userImagePath) => {
//     fs.access(userImagePath)
//             .then(() => fs.unlink(userImagePath))
//             .then(() => console.log("User image was deleted!"))
//             .catch((err) => console.error("User image does not exist!"));
// }

const deleteImage = async (imagePath) => {
    try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);

        console.log("Image was deleted!");
    } catch (error) {
        console.error("Image does not exist!");
        throw error;
    }
}

module.exports = { deleteImage }