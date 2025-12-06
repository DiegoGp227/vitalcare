import Router from "express"
import {prismaClient} from "@primsa/client"
const router = Router()


interface IRegisterUser {
  name : string,
  lasname : string
  email : string,
  password? : string,
  gender : string,
  indetification_number : number,
  date_of_birth : Date,
  phone_number : number,
  is_demo : boolean
}

interface ILoginUser {
  cc : number
}

// router.get("/kfjldsa" , (req , res) => {
//   const body = req.body
//   res.json
// })

router.post("/register", (req , res) => {
  const body : IRegisterUser = req.body
  console.log(body);
  res.json({
    message: "create user"
  })
})



router.post("/login" , (req, res) => {
  const body: ILoginUser = req.body
  console.log(body);

})

export default router
