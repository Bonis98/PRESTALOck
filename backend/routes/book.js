const express = require("express");
const {Product} = require ("../database/models/product");
const moment = require("moment");
const fetch = require("node-fetch");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const router = express.Router();

router.post('/', function (req, res){
    let slotData;
    let UserBorrowProductData;

    function filterSlot(json, maxLoanDays){
        for(let i = 0; i < json.length; i++){
            if (json[i].status.booked === false){
                console.log('free slot found!')
                slotData = json[i];
                break;
            }
        }
        UserBorrowProductData = {
            loanDate: moment(new Date(), moment.ISO_8601),
            lockerSlot: slotData.id,
            terminationDate: moment(moment().add(maxLoanDays, 'days').calendar(), moment.ISO_8601)
        }
    }

    function postBookApi(product){
        Product.update({
            availability: false
        }, {
            where: {
                id: product.id
            }
        }).then() //TODO: wrote method to book with external api sintra
    }

    Product.findOne({
        where: {
            id: req.productId,
            availability: true
        }
    }).then(function(product){
        let maxLoanDays = product.maxLoanDays + 1;
        let url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots?lockerId=' + req.lockerId.toString();

        fetch(url, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        }).then(resp => resp.json())
            .then(json => filterSlot(json, maxLoanDays))
            .then(UserBorrowProduct.create(UserBorrowProductData).then(postBookApi(product)

            ))
        /*let duration = moment.duration({'days': product.maxLoanDays + 1})
        let UserBorrowProductData = {
            loanDate: moment(new Date(), moment.ISO_8601),
            lockerSlot: '',
            terminationDate: moment(moment().add(maxLoanDays, 'days').calendar(), moment.ISO_8601)
            //terminationDate: moment(moment().add(duration).calendar(), moment.ISO_8601)
        }
        UserBorrowProduct.create()*/
    })
})

module.exports = router;