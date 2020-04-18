const multer = require("multer");
const path = require("path");
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb)=> { 
            cb(null, path.resolve(__dirname, '..', '..', 'img', 'uploads'))
        },
        filename: (req, file, cb)=> {
            file.key = file.originalname;
            cb(null, file.key)
        },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'escolaonline',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb)=> {
            const fileName = file.originalname;
            cb(null, fileName)
        },
    })
}
module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'img', 'uploads'),
    storage: storageTypes['s3'],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileSize:(req, file, cb )=> {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
        ];
        if (allowedMimes.includes(file.mimetype)){
            cb(null, true);
        } else {
            cb(new Error("Invalid file type."))
        }
    },
};