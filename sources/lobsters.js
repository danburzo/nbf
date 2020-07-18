/*
	Source: Lobste.rs Saved Bookmarks
 */
module.exports = function(item) {
	return {
		...item,
		uri: (item.url || item.comments_url),
		dateAdded: item.created_at,
		description: `${item.description || ''}\nvia: ${item.comments_url}`
	};
}