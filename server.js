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
	// console.log('req.query', req.query);

	const { data } = await axios
		.get('https://jsonplaceholder.typicode.com/comments', {
			headers: { 'Content-Type': 'application/json' },
		})
		.catch((err) => console.log(err));

	const arr = [];
	Object.entries(req.query).forEach(([k, v]) => {
		arr.push({ [k]: v });
	});

	// console.log('arr', arr);
	let searchResult;
	// for one query
	if (arr.length < 2) {
		searchResult = arr.map((e, index) => {
			if (arr.length === 1) {
				// check for match field
				return data.filter((each, index) => {
					return each[Object.keys(e)[0]] == Object.values(e)[0];
				});
			}
		});
	}

	// for multiple query
	if (arr.length > 1) {
		searchResult = data.filter((each) => {
			return Object.keys(req.query).every((key) => {
				if (each.hasOwnProperty(key)) {
					return each[key] == req.query[key];
				}
			});
		});
	}

	res.send(searchResult);
});

const port = 5004;

app.listen(port, () => {
	console.log(`App listening on port  ${port}...`);
});
