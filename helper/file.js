const fs = require('fs')

const deleteFile = (filePath, next) => {
    fs.unlink(
        filePath,
        (err) => {
            if (err) {
                next(err);
            }
        }
    )
}

exports.deleteFile = deleteFile;