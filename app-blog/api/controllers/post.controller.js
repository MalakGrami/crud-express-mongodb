const slugify = require('slugify');
const db = require('../../database/db.config');
const Post = db.posts;


//create a new post
exports.create=(req, res) => {
    //récupération des données
    const {title, content, author, slug, tags } = req.body;
    if(!title || !content || !author || !slug ) {
        return res.status(400).send({
            message : 'content can not be empty'
        })
    }
const slugy = slugify(slug, '-');
const newPost = new Post({
    title: title,
    content: content,
    author: author,
    slug: slugy,
    tags: tags
});
newPost.save(newPost).then((data) =>{
    res.status(200).send({
        message: 'successufully created post'
    })
}).catch(err =>{
    console.log(err);
});
}


exports.findAll = (req, res) => {
    Post.find({
    }).then((data) => {
    res.send(data);
    }).catch((err) => {
        console.log(err);
    });
}


// Consultation by id
exports.findOne = (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).send({ message: "ID is required" });
    }

    Post.findById(id).then((data) => {
        if (!data) {
            
            return res.status(404).send({ message: `User not found with id ${id}` });
        }

        res.send(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    });
};



//suppression par id 
exports.delete = (req, res) => {
   const id = req.params.id;
   if(!id) {
    res.status(400).send({ message: "content is required "});
   }
   Post.findByIdAndDelete(id).then((data) => {
    if(!data){
        res.status(404).send({ message: "Post not found "});  
    }
    res.status(200).send({ message: "Post was successfull deleted "});
   })
};


exports.update =(req, res) =>{
    const id = req.params.id;
    const {title, content} = req.body;
    if(!id || !title || !content) {
        res.status(400).send({ message: "content is required "});
       }
    Post.findByIdAndUpdate(id,
       {title: title, content: content},
       {useFindAndModify: false}).then((data) =>{
        if(!data){
            res.status(404).send({ message: `Can not update Post with id=${id}`});
        }
        res.status(200).send({ message: `Post was successfully updated`});
    }).catch((err) =>{
        console.log(err);
    });
}