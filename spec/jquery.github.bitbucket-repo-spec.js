describe("jquery.github.bitbucket-repo", function() {

	var instance;

	beforeEach(function() {
		instance = new BitbucketRepo({
			scm: "hg",
			name: "jquery-github",
			description: "A jQuery plugin to display your Github Repositories",
			forks_count: 33,
			utc_last_updated: "2013-07-02T12:08:36Z",
			resource_uri: "/1.0/repositories/zenorocha/jquery-github",
			followers_count: 131
		});
	});

	describe("initialize mercurial BitbucketRepo", function() {
		it("should be repository's name", function() {
			expect(instance.name)
				.toEqual("jquery-github");
		});

		it("should be repository's description", function() {
			expect(instance.description)
				.toEqual("A jQuery plugin to display your Github Repositories");
		});

		it("should be repository's number of forks", function() {
			expect(instance.forks)
				.toEqual(33);
		});

		it("should be repository's last update date", function() {
			expect(instance.pushed_at)
				.toEqual("2013-07-02T12:08:36Z");
		});

		it("should be repository's api url", function() {
			expect(instance.url)
				.toEqual("https://bitbucket.org/zenorocha/jquery-github");
		});

		it("should be repository's number of watchers", function() {
			expect(instance.watchers)
				.toEqual(131);
		});

		it("should be repository's branch name", function() {
			expect(instance.branch)
				.toEqual("default");
		});

		it("should be repository's download URL", function() {
			expect(instance.download_url)
				.toEqual("/get/default.zip");
		});
	});

	describe("initialize git BitbucketRepo", function() {
		var gitinstance;
		beforeEach(function() {
			gitinstance = new BitbucketRepo({
				scm: "git",
				name: "jquery-github",
				description: "A jQuery plugin to display your Github Repositories",
				forks_count: 33,
				utc_last_updated: "2013-07-02T12:08:36Z",
				resource_uri: "/1.0/repositories/zenorocha/jquery-github",
				followers_count: 131
			});
		});

		it("should be repository's branch name", function() {
			expect(gitinstance.branch)
				.toEqual("master");
		});

		it("should be repository's download URL", function() {
			expect(gitinstance.download_url)
				.toEqual("/get/master.zip");
		});
	})

	describe("execute _parsePushedDate()", function() {
		it("should parse repository's pushed_at attribute", function() {
			expect(instance._parsePushedDate(instance.pushed_at))
				.toEqual("2/7/2013");
		});
	});

	describe("execute _parseURL()", function() {
		it("should parse repository's url attribute", function() {
			expect(instance._parseURL(instance.url))
				.toEqual("https://bitbucket.org/zenorocha/jquery-github");
		});
	});

	describe("execute toHTML()", function() {
		// TODO
	});
});
