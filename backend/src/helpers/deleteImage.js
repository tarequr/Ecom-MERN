const fs = require('fs').promises;

// const deleteImage = (userImagePath) => {
//     fs.access(userImagePath)
//             .then(() => fs.unlink(userImagePath))
//             .then(() => console.log("User image was deleted!"))
//             .catch((err) => console.error("User image does not exist!"));
// }

const deleteImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath);
        await fs.unlink(userImagePath);

        console.log("User image was deleted!");
    } catch (error) {
        console.error("User image does not exist!");
        throw error;
    }
}

module.exports = { deleteImage }