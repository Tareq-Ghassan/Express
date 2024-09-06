const mongodb = require('mongodb');
const getDB = require('../helper/database').getDB;

class Product{
  constructor({title,price,description,imageUrl,userId},id){
    this.title=title;
    this.price=price;
    this.description=description;
    this.imageUrl=imageUrl;
    this.userId=userId;
    this._id =id? new mongodb.ObjectId(id):null;
  }
  save(){
    const db = getDB();
    let dbOp;
    if(this._id){
      dbOp=db.collection('products')
      .updateOne({_id:this._id},{$set:this})
    }else{
      dbOp=db.collection('products').insertOne(this)
    }
    return dbOp
    .then(result =>{
      console.log(result);
    }).catch(error =>{
      console.log(error);
      next(error);
    })

  }

  static fetchAll(){
    const db = getDB();
    return db.collection('products').find().toArray()
    .then(products =>{
      return products;
    }).catch(error =>{
      console.log(error);
      next(error);
    })
  }
  static findByPk(id){
    const db = getDB();
    return db.collection('products').find({_id:new mongodb.ObjectId(id)}).next()
    .then(product =>{
      return product;
    }).catch(error =>{
      console.log(error);
      next(error);
    })
  }
  static deleteProduct(id){
    const db = getDB();
    return db.collection('products').deleteOne({_id:new mongodb.ObjectId(id)})
    .then(res =>{
      console.log(res);
    }).catch(error =>{
      console.log(error);
      next(error);
    })
  }
}
module.exports = Product;

