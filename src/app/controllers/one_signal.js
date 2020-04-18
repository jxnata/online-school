module.exports = function() {
    this.sendNotification = function (titulo, msg, usuarios) {
        var data = { 
            app_id: "4b2ede88-1938-4a39-bebf-8b708034fd38",
            headings: { "en": titulo },
            contents: { "en": msg },
            include_player_ids: usuarios,
            android_accent_color: 'FF099E7D',
            ios_badgeType: 'Increase',
            ios_badgeCount: 1,
        };

        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic MDIxM2UyYmYtOWM5OS00Y2QzLThjMTktZGU4MzE1MmIyYzM4"
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