import { Student } from "../model/student.model.js";


export const StudentController = async() => {
try{
const {email, password, studentId} = req.body;

const studentExists = await Student.findOne({
  $or: [
    { email },
    { password },3
    { studentId }
  ]
});

if(studentExists){
  return res.status(400).json({ success: false, message: "Student already exists" });
}

}catch(error){
  next(error)
}
  
  
}
    




