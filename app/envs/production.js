define('config', function() {
	var host = 'data',
		format = '.json',
		repo = 'https://api.github.com/repos/mlhch/articles';

	var urls = {
		articlesTags: repo + '/git/refs/tags',
		recentArticles: repo + '/git/refs/heads',
		articleBlob: function(title, sha) {
			return host + '/articles/blob/' + title + '/' + sha;
		},
		articleTree: function(sha) {
			return repo + '/git/trees/' + sha;
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

	function utf8to16(str) {
		var c1, c2, c3, out = [];

		for (var i = 0, len = str.length; i < len; i++) {
			c1 = str.charCodeAt(i);
			if ((c1 & 0x80) == 0) { // 0xxxxxxx  
				out.push(str[i]);
			} else if ((c1 & 0xe0) == 0xc0) { // 110x xxxx 10xx xxxx  
				c2 = str.charCodeAt(++i);
				out.push(String.fromCharCode(((c1 & 0x1F) << 6) | (c2 & 0x3F)));
			} else if ((c1 & 0xf0) == 0xe0) { // 1110 xxxx 10xx xxxx 10xx xxxx  
				c2 = str.charCodeAt(++i);
				c3 = str.charCodeAt(++i);
				out.push(String.fromCharCode(((c1 & 0x0f) << 12) | ((c2 & 0x3F) << 6) | ((c3 & 0x3F) << 0)));
			}
		}

		return out.join('');
	}

	return {
		utf8to16: utf8to16,
		urls: urls,
		recentArticles: function(success, failure) {
			$.getJSON(urls.recentArticles).done(success).fail(failure);
		},
		articlesTags: function(success, failure) {
			$.getJSON(urls.articlesTags).done(function done(res) {
				success(res.map(function fn(row) {
					return row.ref.replace(/^refs\/tags\//, '').split('.').map(function fn(row) {
						return utf8to16(atob(row));
					}).join('|');
				}));
			}).fail(failure);
		},
		articleBlob: function(title, sha, success, failure) {
			$.getJSON(urls.articleTree(sha))

			.done(function done(res) {
				$.getJSON(res.tree[0].url)

				.done(function done(res) {
					success({
						title: title,
						content: utf8to16(atob(res.content.replace(/\n/g, '')))
					});
				}).fail(failure);
			}).fail(failure);
		}
	}
});