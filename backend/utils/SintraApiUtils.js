const fetch = require("node-fetch");

//Filter out lockers list by user's lockers
module.exports = {
    getLockerList: function (list) {
        //Convert string of ids (1;2;) to int array
        if (!list || !list.length) {
            return []
        }
        const lockerList = String(list).substring(0, list.length - 1).split(';').map(Number);
        let UserLockersList = [];
        return new Promise((resolve, reject) => {
            //retrieving complete lockers list, parsing it and sending it for filtering
            fetch('http://hack-smartlocker.sintrasviluppo.it/api/lockers', {
                method: 'get',
                headers: {
                    "x-apikey": process.env.API_KEY_LOCKERS,
                    "x-tenant": process.env.TENANT
                }
            }).then((resp) => {
                resp.json().then((jsonData) => {
                    jsonData.forEach((locker) => {
                        //Copy only user's lockers
                        if (lockerList.includes(locker.id)) {
                            //Rename fields in English
                            locker.name = locker.nome;
                            locker.region = locker.regione;
                            locker.province = locker.provincia;
                            delete locker.nome;
                            delete locker.regione;
                            delete locker.provincia;
                            //Add element to final array
                            UserLockersList.push(locker)
                        }
                    });
                    resolve(UserLockersList);
                }, (error) => {
                    reject(error);
                })
            }, (error) => {
                reject(error);
            });
        });
    }
};
