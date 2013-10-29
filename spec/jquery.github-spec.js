describe("jquery.github", function() {

	describe("initialize normal Github", function() {
		var instance, requestedData, oldRequestData, oldGetCache;

		beforeEach(function() {
			oldRequestData = Github.prototype.requestData;
			oldGetCache = Github.prototype.getCache;
			Github.prototype.requestData = function ( repo ) {
				requestedData = repo;
			};
			Github.prototype.getCache = function () { return null; };
			instance = new Github("<div data-repo=\"zenorocha/jquery-github\">");
			Github.prototype.requestData = oldRequestData;
			Github.prototype.getCache = oldGetCache;
		});

		it("should request data from the repo in data-repo", function() {
			expect(requestedData).toEqual("zenorocha/jquery-github");
		});

		it("should have a Bitbucket type", function() {
			expect(instance.type)
				.toEqual("Github");
		});
	});

	describe("initialize bb: prefixed Github", function() {
		var instance, requestedData, oldRequestData, oldGetCache;

		beforeEach(function() {
			oldRequestData = Github.prototype.requestData;
			oldGetCache = Github.prototype.getCache;
			Github.prototype.requestData = function ( repo ) {
				requestedData = repo;
			};
			Github.prototype.getCache = function () { return null; };
			instance = new Github("<div data-repo=\"bb:zenorocha/jquery-github\">");
			Github.prototype.requestData = oldRequestData;
			Github.prototype.getCache = oldGetCache;
		});

		it("should request data from the repo in data-repo", function() {
			expect(requestedData).toEqual("zenorocha/jquery-github");
		});

		it("should have a Bitbucket type", function() {
			expect(instance.type)
				.toEqual("Bitbucket");
		});
	});

	describe("initialize gh: prefixed Github", function() {
		var instance, requestedData, oldRequestData, oldGetCache;

		beforeEach(function() {
			oldRequestData = Github.prototype.requestData;
			oldGetCache = Github.prototype.getCache;
			Github.prototype.requestData = function ( repo ) {
				requestedData = repo;
			};
			Github.prototype.getCache = function () { return null; };
			instance = new Github("<div data-repo=\"gh:zenorocha/jquery-github\">");
			Github.prototype.requestData = oldRequestData;
			Github.prototype.getCache = oldGetCache;
		});

		it("should request data from the repo in data-repo", function() {
			expect(requestedData).toEqual("zenorocha/jquery-github");
		});

		it("should have a Bitbucket type", function() {
			expect(instance.type)
				.toEqual("Github");
		});
	});

});
