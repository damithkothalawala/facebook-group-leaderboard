/**
* Our unit tests
* Based on ideas at:
*
*	http://webapplog.com/mocha-test/
*	https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/
*
*/


var request = require('supertest');
var should = require("should");
var tokens = require("../lib/tokens");


describe("Token handling", function () {

	var server;


	beforeEach(function (done) {
		//server = require("../app");

		var token = new tokens();

		token.unlink().then(function() {
			done();

		}).catch(function(err) {
			done(err);

		});

	});


	afterEach(function (done) {
		//delete server;

		var token = new tokens();

		token.unlink().then(function() {
			done();
		}).catch(function(err) {
			done(err);
		});

	});

 	it("clear()", function(done) {

		var token = new tokens();
		token.put("test token", "test name", new Date().getTime() + 1000000).then(function() {

			return token.clear();

		}).then(function() {

			return token.count();

		}).then(function(num) {
			num.should.equal(0);
			done();

		}).catch(function(error) {
			done(error);
		});


	});
 

 	it("get()", function(done) {

		var token = new tokens();
		
		token.put("test token", "test name", new Date().getTime() + 1000000).then(function() {
			return token.put("test token2", "test name2", new Date().getTime() + 1000000);

		}).then(function() {
			return token.count();

		}).then(function(num) {
			num.should.equal(2);

			return(token.get());

		}).then(function(data) {
			data.token.should.equal("test token");
			return(token.get());

		}).then(function(data) {
			data.token.should.equal("test token2");

			return(token.get());
		}).then(function(data) {
			data.token.should.equal("test token");

			done();

		}).catch(function(error) {
			done(error);

		});

	});
 
 	it("get() on empty list", function(done) {

		var token = new tokens();
		token.get().then(function(data) {
			done("We shouldn't have gotten here!");

		}).catch(function(error) {
			error.should.equal("No tokens available!");
			done();

		});

	});
 

 	it("get() on expired data", function(done) {

		var token = new tokens();
		token.put("test token", "test name", new Date().getTime() ).then(function() {
			return token.put("test token2", "test name2", new Date().getTime() );

		}).then(function() {
			return(token.get());

		}).then(function() {
			done("We shouldn't have gotten here!");

		}).catch(function(error) {
			done();

		});

	});
 

 	it("get() on partially expired data", function(done) {

		var token = new tokens();
		token.put("test token", "test name", new Date().getTime() ).then(function() {
			return token.put("test token2", "test name2", new Date().getTime() );

		}).then(function() {
			return token.put("test token3", "test name3", new Date().getTime() + 1000000 );

		}).then(function() {
			return(token.get());

		}).then(function(data) {
			data.token.should.equal("test token3");
			done();

		}).catch(function(error) {
			done(error);

		});

	});
 

 	it("delete()", function(done) {

		var token = new tokens();

		token.put("test token", new Date().getTime() + 1000000).then(function() {
			return token.put("test token2", new Date().getTime() + 1000000);

		}).then(function() {
			return token.put("test token3", new Date().getTime() + 1000000);

		}).then(function() {
			return token.delete("test token");

		}).then(function() {
			return token.get();

		}).then(function(data) {
			data.token.should.equal("test token");

			return token.get();

		}).then(function(data) {
			data.token.should.equal("test token2");
			return token.get();

		}).then(function(data) {
			data.token.should.equal("test token3");
			return token.get();

		}).then(function(data) {
			data.token.should.equal("test token");

			return token.delete("test not here");

		}).then(function() {
			done("we shouldn't be here");

		}).catch(function(error) {
			done();

		});

	});
 


});




