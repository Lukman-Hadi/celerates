const server = require('../app');
const chaiHttp = require('chai-http');
const chai = require('chai');
const should = chai.should();
const crypto = require('crypto')

const User = require("../app/user/model");
const Product = require('../app/product/model')

chai.use(chaiHttp);

const string = crypto.randomBytes(10).toString('hex')+'@mail.com';
let token = '';
console.log(string);
describe('Dengan Token Authentication',function(){
    it('Daftar User',function(done){
        this.timeout(20000);
        chai.request(server)
            .post('auth/register')
            .send({
                'email' :string,
                'password' : string,
                'full_name' : 'testing'
            })
            .end(function(err,res){
                console.log(res);
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                console.info('Response',res.body);
            })
    })
    // it('Login User',function(done){
    //     chai.request(server)
    //         .post('/auth/login')
    // })
})

describe('Tanpa Token Authetication',function(){
    it('Ambil Semua Produk',function(done){
        chai.request(server)
            .get('/api/products')
            .end(function(err,res){
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error')
                res.body.should.have.property('message')
                console.info('Response',res.body);
                done();
            })
    })
    it('Simpan Data Produk',function(done){
        chai.request(server)
            .post('/api/products')
            .send({
                'name':'test',
                'description':'test',
                'price':2000
            })
            .end(function(err,res){
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error')
                res.body.should.have.property('message')
                console.info('Response',res.body);
                done();
            })            
    })
    it('Update Data Produk',function(done){
        chai.request(server)
            .put('/api/products/'+'someId')
            .send({
                'name':'test',
                'description':'test',
                'price':2000
            })
            .end(function(err,res){
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error')
                res.body.should.have.property('message')
                console.info('Response',res.body);
                done();
            })            
    })
    it('Delete Data Produk',function(done){
        chai.request(server)
            .delete('/api/products/'+'someId')
            .end(function(err,res){
                res.should.have.status(401);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error')
                res.body.should.have.property('message')
                console.info('Response',res.body);
                done();
            })            
    })
})