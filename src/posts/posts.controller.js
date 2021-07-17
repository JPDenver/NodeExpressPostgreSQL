const service = require("./posts.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function postExists(req, res, next) {
  const { postId } = req.params;

  const post = await service.read(postId);
  if (post) {
    res.locals.post = post;
    return next();
  }
  return next({ status: 404, message: `Post cannot be found.` });
}

async function create(req, res) {
  // your solution here
  const data = await service.create(req.body.data);
  res.status(201).json({data});
//   res.json({ data: "" });
}

async function update(req, res) {
  // your solution here
  const updatedPost = {
    ...req.body.data,
    post_id: res.locals.post.post_id,
  };
  const data = await service.update(updatedPost);
  res.json({data});
//   res.json({ data: "" });
}

async function destroy(req, res,next) {
  // your solution here
  const {post} = res.locals;
  await service.delete(post.postId);
  res.status(204);
}

module.exports = {
  create: asyncErrorBoundary(create),
  update: [asyncErrorBoundary(postExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(postExists), asyncErrorBoundary(destroy)],
};
