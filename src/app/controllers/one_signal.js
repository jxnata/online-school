module.exports = function() {
    this.sendNotification = function (titulo, msg, usuarios) {
        var data = { 
            app_id: "---APP_ID---",
            headings: { "en": titulo },
            contents: { "en": msg },
            include_player_ids: usuarios,
            android_accent_color: 'FF099E7D',
            ios_badgeType: 'Increase',
            ios_badgeCount: 1,
        };

        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic ---API_KEY---"
        };
        
        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };
        
        var https = require('https');
        var req = https.request(options, function(res) {  
            res.on('data', function(data) {
                console.log(JSON.parse(data));
            });
        });
        
        req.on('error', function(e) {
            console.log(e);
        });
        
        req.write(JSON.stringify(data));
        req.end();
    }
};