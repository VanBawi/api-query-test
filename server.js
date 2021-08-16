const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', async function (req, res) {
	const { data: posts } = await axios.get(
		'https://jsonplaceholder.typicode.com/posts',
		{ headers: { 'Content-Type': 'application/json' } }
	);
	const { data: comments } = await axios.get(
		'https://jsonplaceholder.typicode.com/comments',
		{ headers: { 'Content-Type': 'application/json' } }
	);

	const postData = {};

	posts.forEach((post) => {
		postData[post.id] = {};
		postData[post.id].post_id = post.id;
		postData[post.id].post_title = post.title;
		postData[post.id].post_body = post.body;
		postData[post.id].total_number_of_comments = 0;
	});

	comments.forEach((comment) => {
		postData[comment.postId].total_number_of_comments += 1;
	});

	// - post_id
	// - post_title
	// - post_body
	// - total_number_of_comments

	res.send(Object.values(postData));
	// console.log('comments', comments);
});

app.get('/comments', async function (req, res) {
	// get from client input
	const searchCriteria = {
		id: '',
		postId: '',
		title: '',
		body: 'occaecati quia ipsa id fugit',
		email: '',
		name: '',
	};

	const { data } = await axios.get(
		'https://jsonplaceholder.typicode.com/comments',
		{ headers: { 'Content-Type': 'application/json' } }
	);

	const searchResult = data.filter((e) => {
		const { id, postId, title, body, email, name } = searchCriteria;
		if (id) {
			return e.id == id;
		}
		if (postId) {
			return e.postId == postId;
		}
		if (title) {
			return e.title && e.title.includes(title);
		}
		if (body) {
			return e.body && e.body.includes(body);
		}
		if (email) {
			return e.email === email;
		}

		if (name) {
			const da = e.name && e.name.includes(name);
			return da;
		}
	});

	res.send(searchResult);
});

const port = 5004;

app.listen(port, () => {
	console.log(`App listening on port  ${port}...`);
});
