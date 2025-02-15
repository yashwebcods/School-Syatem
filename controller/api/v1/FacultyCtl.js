module.exports.AddFaculty = (req,res) => {
    try{
        console.log(req.body);
        
    }catch(err){
        return res.status(400).json({mes:'something wrong'})
    }
}