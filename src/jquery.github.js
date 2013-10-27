// -- Github Repository --------------------------------------------------------

function GithubRepo( repo ) {
	this.description = repo.description;
	this.forks = repo.forks;
	this.name = repo.name;
	this.open_issues = repo.open_issues;
	this.pushed_at = repo.pushed_at;
	this.url = repo.url;
	this.watchers = repo.watchers;
	this.branch = repo.branch || "master";
	this.download_url = repo.download_url || "/zipball/master";
	this.watchers_url = repo.watchers_url || "/watchers";
	this.forks_url = repo.forks_frag || "/network";
	this.issues_url = repo.issues_url || "/issues";
}

// Parses HTML template
GithubRepo.prototype.toHTML = function () {
	var self = this;

	self.pushed_at = self._parsePushedDate( self.pushed_at ),
	self.url  = self._parseURL( self.url );

	return $(
		"<div class='github-box'>" +
			"<div class='github-box-header'>" +
				"<h3>" +
					"<a href='" + self.url + "'>" + self.name + "</a>" +
				"</h3>" +
				"<div class='github-stats'>" +
					"<a class='repo-stars' title='Stars' data-icon='7' href='" + self.url + self.watchers_url + "'>" + self.watchers + "</a>" +
					"<a class='repo-forks' title='Forks' data-icon='f' href='" + self.url + self.forks_url + "'>" + self.forks + "</a>" +
					"<a class='repo-issues' title='Issues' data-icon='i' href='" + self.url + self.issues_url + "'>" + self.open_issues + "</a>" +
				"</div>" +
			"</div>" +
			"<div class='github-box-content'>" +
				"<p>" + self.description + " &mdash; <a href='" + self.url + "#readme'>Read More</a></p>" +
			"</div>" +
			"<div class='github-box-download'>" +
				"<p class='repo-update'>Latest commit to <strong>" + self.branch + "</strong> on " + self.pushed_at + "</p>" +
				"<a class='repo-download' title='Download as zip' data-icon='w' href='" + self.url + self.download_url + "'></a>" +
			"</div>" +
		"</div>");
};

// Parses pushed_at with date format
GithubRepo.prototype._parsePushedDate = function ( pushed_at ) {
	var self = this,
			date = new Date( pushed_at );

	return date.getDate() + "/" + ( date.getMonth() + 1 ) + "/" + date.getFullYear();
};

// Parses URL to be friendly
GithubRepo.prototype._parseURL = function ( url ) {
	var self = this;

	return url.replace( "api.", "" ).replace( "repos/", "" );
};

// -- Bitbucket Reposity -------------------------------------------------------

function BitbucketRepo( repo ) {
	var that, bbrepo = {};
	// Transform the bitbucket data into the common format
	bbrepo.description = repo.description;
	bbrepo.forks = repo.forks_count;
	bbrepo.name = repo.name;
	if (repo.logo) {
		bbrepo.name = "<img height=\"16\" width=\"16\" src=\"" + repo.logo + "\"> " + repo.name;
	}
	bbrepo.open_issues = 0;
	bbrepo.pushed_at = repo.utc_last_updated;
	bbrepo.url = "https://bitbucket.org/" + repo.resource_uri.replace("/1.0/repositories/", "");
	if (repo.scm === "hg") {
		bbrepo.branch = "default";
	}
	else {
		bbrepo.branch = "master";
	}
	bbrepo.watchers = repo.followers_count;
	bbrepo.download_url = "/get/" + bbrepo.branch + ".zip";
	bbrepo.watchers_url = "/follow";
	bbrepo.forks_frag = "/fork";
	

	// Parasite off the GithubRepo
	that = new GithubRepo(bbrepo);
	that._parseURL = function ( url ) {
		return url;
	};
	return that;
}

// -- Github Plugin ------------------------------------------------------------

function Github( element, options ) {
	var self = this,
			defaults = {
				iconStars:  true,
				iconForks:  true,
				iconIssues: false
			};

	self.element    = element;
	self.$container = $( element );
	self.repo       = self.$container.attr( "data-repo" );
	self.type       = "Github";

	self.options = $.extend( {}, defaults, options ) ;

	self._defaults = defaults;

	self.init();
}

// Initializer
Github.prototype.init = function () {
	var self   = this,
			cached;

	if ( self.repo.substr( 0, 3 ) === "bb:" ) {
		self.type = "Bitbucket";
		self.options.iconIssues = false;
		self.repoFactory = function ( repo ) {
			return new BitbucketRepo( repo );
		};
		self.repo = self.repo.substr( 3 );
	}

	if ( self.repo.substr( 0, 3 ) === "gh:" ) {
		self.repo = self.repo.substr( 3 );
	}

	cached = self.getCache();
	if ( cached !== null ) {
		self.applyTemplate( JSON.parse( cached ) );
	}
	else {
		self.requestData( self.repo );
	}
};

// Display or hide icons
Github.prototype.displayIcons = function () {
	$iconStars = $( ".repo-stars" );
	$iconForks = $( ".repo-forks" );
	$iconIssues = $( ".repo-issues" );

	if ( this.options.iconStars ) {
		$iconStars.css( "display", "inline-block" );
	} else {
		$iconStars.css( "display", "none" );
	}

	if ( this.options.iconForks ) {
		$iconForks.css( "display", "inline-block" );
	} else {
		$iconForks.css( "display", "none" );
	}

	if ( this.options.iconIssues ) {
		$iconIssues.css( "display", "inline-block" );
	} else {
		$iconIssues.css( "display", "none" );
	}
};

// Request repositories from Github
Github.prototype.requestData = function ( repo ) {
	var fnName = "get" + this.type;
	this[fnName].apply( this, [repo] );
};

// Handle Errors requests
Github.prototype.handleErrorRequest = function ( result_data ) {
	var self = this;

	console.warn( result_data.message );
	return;
};

// Handle Successful request
Github.prototype.handleSuccessfulRequest = function ( result_data ) {
	var self = this;

	self.applyTemplate( result_data );
	self.setCache( result_data );
};

// Stores repostories in sessionStorage if available
Github.prototype.setCache = function ( result_data ) {
	var self = this;

	// Cache data
	if ( window.sessionStorage ) {
		window.sessionStorage.setItem( "gh-repos:" + self.type + ":" + self.repo, JSON.stringify( result_data ) );
	}
};

// Grab cached results
Github.prototype.getCache = function() {
	var self = this;

	if ( window.sessionStorage ) {
		return window.sessionStorage.getItem( "gh-repos:" + self.type + ":" + self.repo );
	}
	else {
		return false;
	}
};

// Apply results to HTML template
Github.prototype.applyTemplate = function ( repo ) {
	var self  = this,
			githubRepo = typeof self.repoFactory === "function" ? self.repoFactory( repo ) : new GithubRepo( repo ),
			$widget = githubRepo.toHTML();

	$widget.appendTo( self.$container );
	self.displayIcons();
};

// -- Provider specific plugins ---------------------------------------------------------

Github.prototype.getGithub = function ( repo ) {
	var self = this;

	$.ajax({
		url: "https://api.github.com/repos/" + repo,
		dataType: "jsonp",
		success: function( results ) {
			var result_data = results.data;

			// Handle API failures
			if ( results.meta.status >= 400 && result_data.message ) {
				self.handleErrorRequest( result_data );
			}
			else {
				self.handleSuccessfulRequest( result_data );
			}
		}
	});
};

Github.prototype.getBitbucket = function ( repo ) {
	var self = this;

	$.ajax({
		url: "https://bitbucket.org/api/1.0/repositories/" + repo,
		dataType: "jsonp",
		success: function( results ) {
			var result_data = results;

			// Handle API failures
			if ( result_data.error ) {
				self.handleErrorRequest( result_data.error );
			}
			else {
				self.handleSuccessfulRequest( result_data );
			}
		}
	});
};

// -- Attach plugin to jQuery's prototype --------------------------------------

;( function ( $, window, undefined ) {

	$.fn.github = function ( options ) {
		return this.each(function () {
			if ( !$( this ).data( "plugin_github" ) ) {
				$( this ).data( "plugin_github", new Github( this, options ) );
			}
		});
	};

}( window.jQuery || window.Zepto, window ) );
