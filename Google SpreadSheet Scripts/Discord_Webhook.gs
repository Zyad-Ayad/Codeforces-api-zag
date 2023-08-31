function sendDiscordMessage(message) {
    let url = "https://discord.com/api/webhooks/1146878404625453088/8Gia8_FSj0FNyk91VxeaCrMug5LuAgE-oNjkP8BSnwOGCiExkTBduTcoZhix_vp3WrrA";
    let payload = JSON.stringify({content: message});
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        payload: payload,
        muteHttpExceptions: true
    };
    let response = UrlFetchApp.fetch(url, params);
    
}



function SendDiscordUpdates(OldStanding) {
    let StandingSheet = SpreadsheetApp.getActive().getSheetByName('Standing');
    let standingData = StandingSheet.getDataRange().getValues();

    let data = {}

    for (let row = 1; row < standingData.length-1; row++) {

        let handle = standingData[row][0];
        data[handle] = {};

        for (let col = 2; col < standingData[row].length; col++) {
            let sheet = standingData[0][col];
            let now = standingData[row][col];
            data[handle][sheet] = {"now": now, "before": 0 };
        }

    }

    for (let row = 1; row < OldStanding.length-1; row++) {

        let handle = OldStanding[row][0];
        if (!(handle in data))
            continue;

        for (let col = 2; col < OldStanding[row].length; col++) {
            let sheet = OldStanding[0][col];
            let old = OldStanding[row][col];
            if(!(sheet in data[handle]))
                continue;
            data[handle][sheet]['before'] = old;
        }
    }

    let message = "";

    let send = false;

    for(handle in data){

        let handleMessage = `**${handle}** Solved :\n`;

        let flag = false;

        for(sheet in data[handle]){
            let now = data[handle][sheet]["now"];
            let before = data[handle][sheet]["before"];
            if(now - before >= 0){

                handleMessage = handleMessage + `          **${now - before}** problems in **${sheet}**\n`;
                flag = true;

            }
        }

        if(!flag)
            continue;

        send = true;

        handleMessage = handleMessage + "\n";

        if(message.length + handleMessage.length > 2000)
        {
            sendDiscordMessage(message);
            message = "";
            send = false;
        }
        message = message + handleMessage + "\n";
    }

    if(send)
        sendDiscordMessage(message);

}
