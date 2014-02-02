define('config', function() {
	var host = 'data',
		format = '.json';

	var urls = {
		tagsdata: host + '/articles/tags' + format,
		recentArticles: host + '/articles/latest/0/branch' + format,
		articleBlob: function(title, sha) {
			return 'http://localhost/api/articles/blob/' + title + '/' + sha;
		},
		thumbnail: function(link, size) {
			return host + '/showcase/thumbnail/' + link + '/200@' + size + '.png';
		},
		snapshot: function(link, size) {
			return host + '/showcase/snapshot/' + link + '/' + size + '.png';
		},
		showcase: function(link) {
			return link;
		}
	};

	return {
		urls: urls,
		recentArticles: function(success, failure) {
			$.getJSON(urls.recentArticles).done(success).fail(failure);
		},
		articleBlob: function(title, sha, success, failure) {
			$.getJSON(urls.articleBlob(title, sha))

			.done(function done(res) {
				success({
					title: title,
					content: res.content
				});
			}).fail(failure);
		}
	}
});