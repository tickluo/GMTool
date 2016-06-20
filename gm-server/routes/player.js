var express = require('express');
//var Player = require('../../shared/models/jttwdb/player');
var router = express.Router();
//var dataApi = require("../../game-server/app/util/dataApi.js");
var Code = require("../../shared/code");
var Promise = require("bluebird");
var request = require('request');
var globalVar = require('../lib/globalVariable');
var accountModel = require('../lib/models/account');
var util = require('../lib/utility');

router.post('/*', function (req, res) {
    var datas = req.body;
    if (!datas) {
        return;
    }
    /*var astServer = globalVar.getAstServer(datas.astIds);
    if (!astServer) {
        res.status(500).send('error');
        return;
    }*/
    request.post(util.generatePostOption(globalVar.generateURL(globalVar.accountServerURL, '/gm/accountUpdate'), datas),
        function (e, r, httpBody) {
            if (e) {
                res.status(500).send(e);
                return;
            }

            if (r.statusCode !== 200) { // HTTP OK
                res.status(500).send('Bad status code ' + r.statusCode + '. body is ' + httpBody);
                return;
            }
            var body = JSON.parse(httpBody);
            if (body.code === undefined || body.code !== Code.OK) {
                res.status(500).send('failed, error : ' + JSON.stringify(body.error));
                return;
            }
            res.send(body.data);
        }
    );
});
/*
 router.expHeroData = function(heros){
 var r = {};
 for(var key in heros){
 var h = dataApi.hero.findById(heros[key].id);
 if(!!h){
 var k;
 var skill;
 var item;
 for(k in heros[key]){
 h[k] = heros[key][k];
 }
 for(k in heros[key].equipments){
 if(k.id === 0)
 {
 continue;
 }
 item = dataApi.item.findById(k.id);
 if(!!item )
 {
 h.equipments[k] =  item;
 }
 }
 for(k in heros[key].skills){
 skill = dataApi.skill.findById(k.id);
 if(!!skill)
 {
 h.skills[k] =  skill;
 }
 }

 for(k in heros[key].pskills){
 skill = dataApi.skill.findById(k.id);
 if(!!skill)
 {
 h.pskills[k] =  skill;
 h.pskills[k].use = k.use;
 }
 }
 r[key] = h;
 }
 }

 return r;
 };

 router.expItemData = function(items){
 var r = [];
 for(var i = 0; i < items.length; ++i){
 var item = dataApi.item.findById(items[i].id);
 if(!!item){
 item.count = items[i].count;
 r.push(item);
 }
 }
 return r;
 };

 router.expSpiritData = function(spirits){
 var r = {};
 for(var key in spirits){
 var h = dataApi.spirit.findById(spirits[key].id);
 if(!!h){
 r[key] = spirits[key];

 r[key].name = h.name;
 }
 }
 return r;
 };

 router.get('/user/:user', function(req, res) {
 var name = (req.params.user);

 Player.getPlayerByName(name, function(err, data){
 if(!!data){
 data.title = "Player";
 data.userName = name;
 data.found = true;
 data.message = "";
 data.data.heros = router.expHeroData(data.data.heros);
 data.data.items = router.expItemData(data.data.items);
 data.data.spirits = router.expSpiritData(data.data.spirits);
 }
 else{
 data = router.emptyData();
 data.message = "没有找到";
 }

 res.send(data);
 });

 });
 */
router.emptyData = function () {
    var data = {};
    data.title = "No Player Select";
    data.userName = "";
    data.message = "";
    data.found = false;
    return data;
};

module.exports = router;
