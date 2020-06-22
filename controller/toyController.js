const express = require('express');

const mongoose = require('mongoose');

const Toy = mongoose.model('Toy');

const router = express.Router();

router.get("/",(req,res) => {
    res.render("toy/addOrEdit",{
        viewTitle:"Insert Product"
    })
})

router.post("/",(req,res) => {
    if(req.body._id == "")
    {
    insertRecord(req,res);
    }
    else{
        updateRecord(req,res);
    }
})

function insertRecord(req,res)
{
   var toy = new Toy();

   toy.name = req.body.name;

   toy.price = req.body.price;

   toy.amount = req.body.amount;

   toy.description = req.bod.description;

   toy.save((err,doc) => {
       if(!err){
        res.redirect('toy/list');
       }
       else{
           
          if(err.name == "ValidationError"){
              handleValidationError(err,req.body);
              res.render("toy/addOrEdit",{
                  viewTitle:"Insert Product",
                  toy:req.body
              })
          }

          console.log("Error occured during record insertion" + err);
       }
   })
}

function updateRecord(req,res)
{
    Toy.findOneAndUpdate({_id:req.body._id,},req.body,{new:true},(err,doc) => {
        if(!err){
            res.redirect('toy/list');
        }
        else{
            if(err.name == "ValidationError")
            {
                handleValidationError(err,req.body);
                res.render("toy/addOrEdit",{
                    viewTitle:'Update Product',
                    toy:req.body
                });
            }
            else{
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list',(req,res) => {

    Toy.find((err,docs) => {
        if(!err) {
            res.render("toy/list",{
               list:docs
            })
        }
    })
})

router.get('/:id',(req,res) => {
    Toy.findById(req.params.id,(err,doc) => {
        if(!err){
            res.render("toy/addOrEdit",{
                viewTitle: "Update Product",
                toy: doc
            })
        }
    })
})

router.get('/delete/:id',(req,res) => {
    Toy.findByIdAndRemove(req.params.id,(err,doc) => {
        if(!err){
            res.redirect('/toy/list');
        }
        else{
            console.log("An error occured during the Delete Process" + err);
        }
    })
})

// function handleValidationError(err,body){
//     for(field in err.errors)
//     {
//         switch(err.errors[field].path){
//         case 'fullName':
//               body['fullNameError'] = err.errors[field].message;
//               break;
        
//         case 'email':
//               body['emailError'] = err.errors[field].message;
//               break;

//         default:
//            break;
//         }
//     }
// }

module.exports = router;