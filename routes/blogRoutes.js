const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');
const {clearHash}=require('../services/cache')
module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    
    console.log(req.user.id )
console.log("sa")
      const blogs = await Blog.find({ _user: req.user.id }).
     cache({key:req.user.id} );
    
    res.send(blogs);
  
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content,imageUrl } = req.body;

    const blog = new Blog({
     imageUrl,
      title,
      content,
      _user: req.user.id
    })

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
clearHash(req.user.id)

  });
};
