const aws = require('aws-sdk');

module.exports = {
    removeS3(arrayImg) {
        var s3 = new aws.S3();
        var deleteList = [];
    
        arrayImg.forEach(img => {
          filename = img.url.substr(img.url.lastIndexOf('/') + 1, img.url.length)
          deleteList.push({ Key: filename });
        });
    
        var params = { Bucket: 'escolaonline', Delete: { Objects: deleteList } };
        s3.deleteObjects(params, function(err, data){});
    }
}
